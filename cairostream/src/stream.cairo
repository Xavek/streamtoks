use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, starknet::Store)]
struct StreamStruct {
    sender: ContractAddress,
    receiver: ContractAddress,
    amount_to_be_stream: u256,
    end_time: u64,
    flow_rate: u64,
}

#[starknet::interface]
trait ITokenLocal<T> {
    fn name(self: @T) -> felt252;
    fn totalSupply(self: @T) -> u256;
    fn symbol(self: @T) -> felt252;
    fn balanceOf(self: @T, account: ContractAddress) -> u256;
    fn transfer_from(
        ref self: T, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
    fn transfer(ref self: T, recipient: ContractAddress, amount: u256) -> bool;
    fn get_faucet(ref self: T, receiver: ContractAddress) -> bool;
    fn createStream(ref self: T, stream_info: StreamStruct) -> felt252;
    fn balanceOfStream(self: @T, hash_id: felt252) -> u256;
    fn cancelStream(ref self: T, hash_id: felt252) -> bool;
    fn WithdrawFromStream(ref self: T, hash_id: felt252) -> bool;
}

#[starknet::contract]
mod stream {
    use super::{ContractAddress, ITokenLocal, StreamStruct};
    use starknet::{
        get_caller_address, get_block_timestamp, get_contract_address, contract_address_const,
        ContractAddressIntoFelt252
    };
    use core::zeroable::Zeroable;
    use core::traits::{Into, TryInto};
    use core::poseidon::PoseidonTrait;
    use core::poseidon::poseidon_hash_span;
    use core::hash::{HashStateTrait, HashStateExTrait};

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct StreamSnapshot {
        is_active: bool,
        entry_time: u64
    }

    #[storage]
    struct Storage {
        name: felt252,
        total_supply: u256,
        symbol: felt252,
        balances: LegacyMap<ContractAddress, u256>,
        hash_to_stream_snapshot: LegacyMap<felt252, StreamSnapshot>,
        hash_to_stream_struct: LegacyMap<felt252, StreamStruct>
    }

    #[constructor]
    fn constructor(ref self: ContractState, name: felt252, symbol: felt252) {
        self.name.write(name);
        self.total_supply.write(1000000);
        self.symbol.write(symbol);
        self.balances.write(get_contract_address(), 1000000)
    }

    #[abi(embed_v0)]
    impl TokenImpl of ITokenLocal<ContractState> {
        // reads the name of our ERC-20 token and gives back returns it
        fn name(self: @ContractState) -> felt252 {
            self.name.read()
        }
        // reads the supply of our ERC-20 token and gives back, returns it
        fn totalSupply(self: @ContractState) -> u256 {
            self.total_supply.read()
        }
        // reads the symbol of our ERC-20 token and gives back, returns it
        fn symbol(self: @ContractState) -> felt252 {
            self.symbol.read()
        }
        // checks the balance of the provided address and returns it
        fn balanceOf(self: @ContractState, account: ContractAddress) -> u256 {
            self.balances.read(account)
        }
        // transfers from caller to recipient the amount
        fn transfer(ref self: ContractState, recipient: ContractAddress, amount: u256) -> bool {
            self.transfer_from(get_caller_address(), recipient, amount)
        }
        // transfers from sender to recipient amount
        fn transfer_from(
            ref self: ContractState,
            sender: ContractAddress,
            recipient: ContractAddress,
            amount: u256
        ) -> bool {
            let mut sender_balance = self.balances.read(sender);
            assert(sender_balance >= amount, 'INSUFFICIENT BALANCE');
            sender_balance -= amount;
            self.balances.write(sender, sender_balance);

            let mut receiver_balance = self.balances.read(recipient);
            receiver_balance += amount;
            self.balances.write(recipient, receiver_balance);
            true
        }
        fn get_faucet(ref self: ContractState, receiver: ContractAddress) -> bool {
            self.transfer_from(get_contract_address(), receiver, 1000);
            true
        }
        fn createStream(ref self: ContractState, stream_info: StreamStruct) -> felt252 {
            let caller = get_caller_address();
            assert(stream_info.end_time > get_block_timestamp(), 'LATE');
            assert(self.balanceOf(caller) > stream_info.amount_to_be_stream, 'INSUFFICENT BALANCE');
            let stream_snap_info = StreamSnapshot {
                is_active: true, entry_time: get_block_timestamp()
            };

            let hash_id = PoseidonTrait::new()
                .update(stream_info.receiver.into())
                .update(stream_info.flow_rate.into())
                .finalize();

            self.hash_to_stream_snapshot.write(hash_id, stream_snap_info);
            self.hash_to_stream_struct.write(hash_id, stream_info);

            hash_id
        }
        fn balanceOfStream(self: @ContractState, hash_id: felt252) -> u256 {
            let (current, _) = self.get_balance_of_stream(hash_id);
            current
        }

        fn cancelStream(ref self: ContractState, hash_id: felt252) -> bool {
            let caller = get_caller_address();
            assert(
                caller == self.hash_to_stream_struct.read(hash_id).sender
                    || caller == self.hash_to_stream_struct.read(hash_id).receiver,
                'ONLY RECEIVER OR SENDER CANCEL'
            );
            assert(
                self.hash_to_stream_snapshot.read(hash_id).is_active == true, 'STREAM NOT EXIST'
            );
            let (streamed_balance, _) = self.get_balance_of_stream(hash_id);
            let sender_addr = self.hash_to_stream_struct.read(hash_id).sender;
            let receiver_addr = self.hash_to_stream_struct.read(hash_id).receiver;
            self
                .hash_to_stream_struct
                .write(
                    hash_id,
                    StreamStruct {
                        sender: contract_address_const::<0>(),
                        receiver: contract_address_const::<0>(),
                        flow_rate: 0,
                        end_time: 0,
                        amount_to_be_stream: 0
                    }
                );
            self
                .hash_to_stream_snapshot
                .write(hash_id, StreamSnapshot { is_active: false, entry_time: 0 });
            self.transfer_from(sender_addr, receiver_addr, streamed_balance);
            true
        }

        fn WithdrawFromStream(ref self: ContractState, hash_id: felt252) -> bool {
            let caller = get_caller_address();
            assert(
                caller == self.hash_to_stream_struct.read(hash_id).receiver, 'ONLY RECEIVER CALL'
            );
            assert(
                self.hash_to_stream_snapshot.read(hash_id).is_active == true,
                'STREAM ALREADY CANCELED'
            );
            let (current, _) = self.get_balance_of_stream(hash_id);
            assert(
                current == self.hash_to_stream_struct.read(hash_id).amount_to_be_stream,
                'STREAM NOT ENDED'
            );
            self
                .hash_to_stream_snapshot
                .write(hash_id, StreamSnapshot { is_active: false, entry_time: 0 });
            self
                .transfer_from(
                    self.hash_to_stream_struct.read(hash_id).sender,
                    self.hash_to_stream_struct.read(hash_id).receiver,
                    current
                );

            true
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn get_balance_of_stream(self: @ContractState, hash_id: felt252) -> (u256, u256) {
            assert(
                self.hash_to_stream_snapshot.read(hash_id).is_active == true,
                'STREAM NOT CREATED OR CANCELED'
            );
            assert(
                get_block_timestamp() > self.hash_to_stream_snapshot.read(hash_id).entry_time,
                'STREAM YET TO START'
            );
            let time_elapsed = get_block_timestamp()
                - self.hash_to_stream_snapshot.read(hash_id).entry_time;
            // current balance is flowRate * (seconds elapsed)
            let current_balance: u256 = (time_elapsed
                * self.hash_to_stream_struct.read(hash_id).flow_rate)
                .into();
            if (current_balance > self.hash_to_stream_struct.read(hash_id).amount_to_be_stream) {
                (self.hash_to_stream_struct.read(hash_id).amount_to_be_stream, 0)
            } else {
                let remaining_balance = self.hash_to_stream_struct.read(hash_id).amount_to_be_stream
                    - current_balance;
                (current_balance, remaining_balance)
            }
        }
    }
}
