import "./App.css";

import React from "react";
import { Outlet } from "react-router-dom";

import { NavBar } from "./components/nav-bar/nav-bar";

export const Layout = ({ setToastMessage, toastMessage }) => {
  return (
    <div className="App">
      <NavBar toastMessage={toastMessage} setToastMessage={setToastMessage} />
      <Outlet />
    </div>
  );
};
