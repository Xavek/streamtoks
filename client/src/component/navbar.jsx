import { useState } from "react";
import { useAccount, useConnectors } from "@starknet-react/core";
import { sliceAddressForView } from "../lib/utils";
import { getAddressFaucetBalance, mintFaucet } from "../lib/api";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { connect, connectors } = useConnectors();
  const { address, status, account } = useAccount();
  const [faucetBalance, setFucetBalance] = useState("");
  const handleGetFaucet = async (e) => {
    e.preventDefault();
    const contractResponse = await mintFaucet(account, address);
    console.log(contractResponse);
  };
  const handleFaucetBalance = async (e) => {
    e.preventDefault();
    const contractResponse = await getAddressFaucetBalance(address);
    setFucetBalance(contractResponse.toString());
    console.log(contractResponse);
  };

  return (
    <nav className="bg-black p-4 flex justify-between">
      <div className="flex items-center">
        <span className="text-white text-xl font-bold">Stream It</span>
      </div>
      <div className="flex items-center">
        <button
          className="bg-white text-black px-6 py-2  rounded-md"
          onClick={handleFaucetBalance}
        >
          {faucetBalance.length > 0
            ? `Faucet: ${faucetBalance}`
            : "Check Faucet Balance"}
        </button>
        <button
          className="bg-white text-black px-6 py-2 mx-2 rounded-md"
          onClick={handleGetFaucet}
        >
          Mint Faucet
        </button>
        <button className="bg-white text-black px-6 py-2 mx-2 rounded-md">
          <Link to={`/balance`}>Stream Balance</Link>
        </button>
        <button className="bg-white text-black px-6 py-2 rounded-md">
          <Link to={`/withdraw`}>Withdraw</Link>
        </button>
        <button className="bg-white text-black px-6 py-2 mx-2 rounded-md">
          <Link to={`/cancel`}>Cancel</Link>
        </button>
        <ul>
          {status === "disconnected" &&
            connectors.map((connector) => (
              <li key={connector.id}>
                <button
                  onClick={() => connect(connector)}
                  className="bg-white text-black px-6 py-2 mx-2 rounded-md"
                >
                  Connect To {connector.id}
                </button>
              </li>
            ))}

          {status === "connected" &&
            connectors.map((connector) => (
              <li key={connector.id}>
                <button
                  className="bg-white text-black px-6 py-2 mx-2 rounded-md"
                  onClick={() => connect(connector)}
                >
                  {sliceAddressForView(address)}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
