import ContractInteraction from "./rpc";

export const mintFaucet = async (account, receiverAddress) => {
  const contractInstance = ContractInteraction;
  const contractInokeData = [receiverAddress];
  const contractResponse = await contractInstance.invokeContractFunction(
    account,
    "get_faucet",
    contractInokeData
  );
  return contractResponse;
};
export const createStream = async (account, streamInfoObj) => {
  const contractInstance = ContractInteraction;
  const contractInokeData = [streamInfoObj];
  const contractResponse = await contractInstance.invokeContractFunction(
    account,
    "createStream",
    contractInokeData
  );
  console.log(contractResponse);
};
export const cancelStream = async (account, uniqueHashId) => {
  const contractInstance = ContractInteraction;
  const contractInokeData = [uniqueHashId];
  const contractResponse = await contractInstance.invokeContractFunction(
    account,
    "cancelStream",
    contractInokeData
  );
  console.log(contractResponse);
};
export const balanceOfStream = async (uniqueHashId) => {
  const contractInstance = ContractInteraction;
  const contractInokeData = [uniqueHashId];
  const contractResponse = await contractInstance.readContractFunction(
    "balanceOfStream",
    contractInokeData
  );
  return contractResponse;
};
export const withdrawFromStream = async (account, uniqueHashId) => {
  const contractInstance = ContractInteraction;
  const contractInokeData = [uniqueHashId];
  const contractResponse = await contractInstance.invokeContractFunction(
    account,
    "WithdrawFromStream",
    contractInokeData
  );
  console.log(contractResponse);
};
export const getAddressFaucetBalance = async (address) => {
  const contractInstance = ContractInteraction;
  const contractReadData = [address];
  const contractResponse = await contractInstance.readContractFunction(
    "balanceOf",
    contractReadData
  );
  return contractResponse;
};
