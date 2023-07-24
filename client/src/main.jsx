import ReactDOM from "react-dom/client";
import { StarknetConfig, InjectedConnector } from "@starknet-react/core";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WithdrawPage from "./component/withdraw.jsx";
import CancelPage from "./component/cancel.jsx";
import CheckBalancePage from "./component/balance.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/withdraw",
    element: <WithdrawPage />,
  },
  {
    path: "/cancel",
    element: <CancelPage />,
  },
  {
    path: "/balance",
    element: <CheckBalancePage />,
  },
]);
const connectors = [new InjectedConnector({ options: { id: "argentX" } })];
ReactDOM.createRoot(document.getElementById("root")).render(
  <StarknetConfig connectors={connectors}>
    <RouterProvider router={router} />
  </StarknetConfig>
);
