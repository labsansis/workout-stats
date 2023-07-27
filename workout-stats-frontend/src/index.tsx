import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { RecoilRoot } from "recoil";
import SignUp from "./components/userAuth/SignUp";
import SignIn from "./components/userAuth/SignIn";
import SignOut from "./components/userAuth/SignOut";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
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
    path: "upload",
    element: <Dashboard page="upload" />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "signin",
    element: <SignIn />,
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
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
