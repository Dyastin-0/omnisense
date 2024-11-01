import { set } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [areDevicesIncluded, setAreDevicesIncluded] = useState(false);
  const [areInactiveDaysIncluded, setAreInactiveDaysIncluded] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState("Default");

  const toggleIncludeDevice = () => {
    const current = !areDevicesIncluded;
    setAreDevicesIncluded(current);
    localStorage.setItem("areDevicesIncluded", current);
  };

  const toggleIncludeInactiveDays = () => {
    const current = !areInactiveDaysIncluded;
    setAreInactiveDaysIncluded(current);
    localStorage.setItem("areInactiveDaysIncluded", current);
  };

  useEffect(() => {
    const deviceIncluded = localStorage.getItem("areDevicesIncluded");
    const inactiveDaysIncluded = localStorage.getItem(
      "areInactiveDaysIncluded"
    );
    const selectedInstance = localStorage.getItem("selectedInstance");

    if (selectedInstance !== null) {
      setSelectedInstance(selectedInstance);
    }

    if (deviceIncluded !== null) {
      setAreDevicesIncluded(deviceIncluded === "true");
    }
    if (inactiveDaysIncluded !== null) {
      setAreInactiveDaysIncluded(inactiveDaysIncluded === "true");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    theme === "dark" ? darkTheme() : lightTheme();
  }, [theme]);

  const lightTheme = () => {
    const root = document.documentElement;
    root.classList.remove("dark");
  };

  const darkTheme = () => {
    const root = document.documentElement;
    root.classList.add("dark");
  };

  const value = {
    theme,
    toggleTheme,
    areDevicesIncluded,
    toggleIncludeDevice,
    areInactiveDaysIncluded,
    toggleIncludeInactiveDays,
    selectedInstance,
    setSelectedInstance,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
