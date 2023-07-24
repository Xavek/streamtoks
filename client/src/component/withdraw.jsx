import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { withdrawFromStream } from "../lib/api";

const WithdrawPage = () => {
  const { account } = useAccount();
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdrawAmountChange = (event) => {
    setWithdrawAmount(event.target.value);
  };

  const handleWithdrawButtonClick = async (e) => {
    e.preventDefault();
    console.log(account);
    const contractResponse = await withdrawFromStream(account, withdrawAmount);
    console.log(withdrawAmount);
    console.log(contractResponse);
    setWithdrawAmount("");
  };

  return (
    <div className="w-1/2 mx-auto mt-8">
      <div className="mb-2">
        <label htmlFor="withdrawAmount" className="block mb-1 font-semibold">
          Enter Unique ID
        </label>
        <input
          type="text"
          id="withdrawAmount"
          name="withdrawAmount"
          value={withdrawAmount}
          onChange={handleWithdrawAmountChange}
          placeholder="Enter the hash ID 0xbcd5f..."
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
      </div>
      <button
        onClick={handleWithdrawButtonClick}
        className="bg-black text-white px-4 py-2 rounded-md w-full"
      >
        Withdraw
      </button>
    </div>
  );
};

export default WithdrawPage;
