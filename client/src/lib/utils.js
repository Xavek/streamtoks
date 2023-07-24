// converts felt252 hash into the string. Converts 0x0abcd.. into string
export const feltToString = (felt) =>
  felt
    // To hex
    // .toString(16)
    // Split into 2 chars
    .match(/.{2}/g)
    // Get char from code
    .map((c) => String.fromCharCode(parseInt(c, 16)))
    // Join to a string
    .join("");

// slices the string first  chars and last chars
export const sliceAddressForView = (addrs) => {
  return `${addrs.slice(0, 6)}...${addrs.slice(-6)}`;
};
// constants like deployed address and alchemy api
export const DEPLOYED_ADDRESS =
  "0x0560acdf87a470ce15eadc343a5ee68af2e7d827849df06e3045488d6c066f3b";
const ALCHEMY_KEY = import.meta.env.VITE_APP_ALCHEMY_API_KEY;
export const RPC_URL = `https://starknet-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`;
