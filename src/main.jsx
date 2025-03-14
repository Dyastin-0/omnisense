import React from "react";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "./contexts/auth/auth";

import { SettingsProvider } from "./contexts/settings/settings";
import { DataProvider } from "./contexts/data/data";
import App from "./app";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>{<App />}</DataProvider>
      </AuthProvider>
    </SettingsProvider>
  </React.StrictMode>
);
