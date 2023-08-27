import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { RecoilRoot } from "recoil";
import SignOut from "./components/userAuth/SignOut";
import UserAuthPage from "./components/userAuth/UserAuthPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "home",
    element: <Dashboard page="home" />,
  },
  {
    path: "strength",
    element: <Dashboard page="strength" />,
  },
  {
    path: "exercises",
    element: <Dashboard page="exercises" />,
  },
  {
    path: "account",
    element: <Dashboard page="account" />,
  },
  {
    path: "upload",
    element: <Dashboard page="upload" />,
  },
  {
    path: "volume",
    element: <Dashboard page="volume" />,
  },
  {
    path: "signup",
    element: <UserAuthPage kind="signup" />,
  },
  {
    path: "signin",
    element: <UserAuthPage kind="signin" />,
  },
  {
    path: "signout",
    element: <SignOut />,
  },
]);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
