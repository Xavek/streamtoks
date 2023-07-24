import { useState } from "react";
import { balanceOfStream } from "../lib/api";

const CheckBalancePage = () => {
  const [amount, setAmount] = useState("");
  const [currentBalance, setCurrentBalance] = useState(null);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleCheckBalanceClick = async (e) => {
    e.preventDefault();
    const contractResponse = await balanceOfStream(amount);
    console.log(contractResponse);
    setCurrentBalance(contractResponse.toString());
    setAmount("");
  };

  return (
    <div className="w-1/2 mx-auto mt-8">
      <div className="mb-2">
        <label htmlFor="amount" className="block mb-1 font-semibold">
          Enter Unique ID
        </label>
        <input
          type="text"
          id="amount"
          name="amount"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter the hash ID 0xbcd5f..."
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
      </div>
      <button
        onClick={handleCheckBalanceClick}
        className="bg-black text-white px-4 py-2 rounded-md w-full"
      >
        Check Balance
      </button>
      {currentBalance !== null && (
        <p className="mt-4 font-semibold">
          Current Streaming Balance: {currentBalance}
        </p>
      )}
    </div>
  );
};

export default CheckBalancePage;
