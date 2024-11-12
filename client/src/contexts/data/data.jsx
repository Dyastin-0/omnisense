import React, { createContext, useContext, useEffect, useState } from "react";

import { onValue, ref, query } from "firebase/database";

import { db } from "../../config/firebase";
import { useAuth } from "../auth/auth";
import {
  calculateConsumptionAndCost,
  calculateDevicesUptime,
  divideDataByMonth,
} from "../../utils/chart-helper";
import { useSettings } from "../settings/settings";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { areInactiveDaysIncluded } = useSettings();

  const { user, userDataPath } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [devices, setDevices] = useState(null);
  const [messages, setMessages] = useState(null);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [months, setMonths] = useState([]);
  const [monthsUptime, setMonthsUptime] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [instances, setInstances] = useState(["Default"]);
  const [microcontroller, setMicrocontroller] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const instancesRef = ref(db, `/${user.uid}`);
      onValue(instancesRef, (snapshot) => {
        setInstances(Object.keys(snapshot.val()) || []);
      });

      const instanceRef = ref(db, `/${userDataPath}`);
      onValue(instanceRef, (snapshot) => {
        setMicrocontroller(snapshot.val()?.microcontroller);
      });

      const devicesRef = ref(db, `/${userDataPath}/devices`);

      onValue(devicesRef, (snapshot) => {
        setDevices(snapshot.val() || []);
      });

      const messagesRef = ref(db, `/${userDataPath}/messages`);
      const queryRef = query(messagesRef);

      onValue(queryRef, (snapshot) => {
        setMessages(snapshot.val() || []);
      });
    };

    user && fetchData();
  }, [user, userDataPath]);

  useEffect(() => {
    setIsFetching(!(devices !== null) && messages !== null);
  }, [devices, messages]);

  useEffect(() => {
    if (messages) {
      const date = new Date();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      setCurrentMonth(key);

      const months = divideDataByMonth(messages);

      const data = Object.entries(months).map(([key, value]) => {
        return {
          month: key,
          data: calculateDevicesUptime(value, devices),
        };
      });

      setMonthsUptime(data);

      const monthsData = data.map((month) => {
        return {
          month: month.month,
          ...calculateConsumptionAndCost(month.data, devices),
        };
      });

      setCurrentMonthData(monthsData.find((month) => month.month === key));
      setMonths(monthsData);
    }
  }, [messages, areInactiveDaysIncluded]);

  const value = {
    isFetching,
    devices,
    messages,
    months,
    monthsUptime,
    currentMonthData,
    currentMonth,
    instances,
    microcontroller,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
