import { Contract, RpcProvider } from "starknet";
import { DEPLOYED_ADDRESS, RPC_URL } from "./utils";

class ContractInteractionClass {
  constructor(apiUrl, deployedAddress) {
    this.apiUrl = apiUrl;
    this.deployedAddress = deployedAddress;
  }
  getProviderRPCInstance() {
    return new RpcProvider({ nodeUrl: this.apiUrl });
  }
  async getContractInstance(account) {
    const { abi } = await this.getProviderRPCInstance().getClassAt(
      this.deployedAddress
    );
    const contractInstance = new Contract(abi, this.deployedAddress, account);
    return contractInstance;
  }
  async getContractReadInstance() {
    const { abi } = await this.getProviderRPCInstance().getClassAt(
      this.deployedAddress
    );
    const contractReadInstance = new Contract(
      abi,
      this.deployedAddress,
      this.getProviderRPCInstance()
    );
    return contractReadInstance;
  }
  async invokeContractFunction(account, functionName, contractCallData) {
    const myContractInstance = this.getContractInstance(account);
    return (await myContractInstance).invoke(functionName, contractCallData);
  }
  async readContractFunction(functionName, contractCallData) {
    const myReadContractInstance = this.getContractReadInstance();
    return (await myReadContractInstance).call(functionName, contractCallData);
  }
}
const ContractInteraction = new ContractInteractionClass(
  RPC_URL,
  DEPLOYED_ADDRESS
);
export default ContractInteraction;
