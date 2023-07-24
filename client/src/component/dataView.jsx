/* eslint-disable react/prop-types */
const DataShow = ({ data }) => {
  return (
    <div className="w-1/2 mx-auto mt-7">
      <p className="text-lg font-semibold">Current Streams</p>
      <table className="table-auto border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">No Of Stream</th>
            <th className="border border-gray-300 px-4 py-2">Stream ID</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([field, value]) => (
            <tr key={field}>
              <td className="border border-gray-300 px-4 py-2">
                {parseInt(field) + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">{value}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="bg-black text-white px-2 py-2 rounded-md">
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataShow;
