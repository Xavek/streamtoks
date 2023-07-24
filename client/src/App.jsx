import DataShow from "./component/dataView";
import StreamInputPage from "./component/inputForm";
import Navbar from "./component/navbar";
function App() {
  const dataArr = ["0xabcdfgkl87654"];
  return (
    <>
      <Navbar />
      <StreamInputPage />
      <DataShow data={dataArr} />
    </>
  );
}

export default App;
