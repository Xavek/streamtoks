import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { cancelStream } from "../lib/api";

const CancelPage = () => {
  const { account } = useAccount();
  const [uniqueStreamId, setUniqueId] = useState("");

  const handleCancelStream = (event) => {
    setUniqueId(event.target.value);
  };

  const handleCancelStreamButton = async (e) => {
    e.preventDefault();
    const contractResponse = await cancelStream(account, uniqueStreamId);
    console.log(contractResponse);

    console.log(uniqueStreamId);
  };

  return (
    <div className="w-1/2 mx-auto mt-8">
      <div className="mb-2">
        <label htmlFor="cancelStream" className="block mb-1 font-semibold">
          Enter Unique ID
        </label>
        <input
          type="text"
          id="cancelStream"
          name="cancelStream"
          value={uniqueStreamId}
          onChange={handleCancelStream}
          placeholder="Enter the hash ID 0xbcd5f..."
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
      </div>
      <button
        onClick={handleCancelStreamButton}
        className="bg-black text-white px-4 py-2 rounded-md w-full"
      >
        Cancel
      </button>
    </div>
  );
};

export default CancelPage;
