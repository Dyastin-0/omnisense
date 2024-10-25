import React, { createContext, useContext, useEffect, useState } from "react";

import { onValue, ref, query, orderByChild, startAt } from "firebase/database";

import { db } from "../../config/firebase";
import { useAuth } from "../auth/auth";
import {
  calculateConsumption,
  calculateDevicesUptime,
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
  const [chartData, setChartData] = useState([]);
  const [consumptionData, setConsumptionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const devicesRef = ref(db, `/${userDataPath}/devices`);

      onValue(devicesRef, (snapshot) => {
        setDevices(snapshot.val() || []);
      });

      const currentTimestamp = Date.now();
      const sevenDaysAgoTimestamp =
        currentTimestamp - 8 * 24 * 60 * 60 * 1000 + 1000;
      const messagesRef = ref(db, `/${userDataPath}/messages`);
      const queryRef = query(
        messagesRef,
        orderByChild("timeSent"),
        startAt(sevenDaysAgoTimestamp)
      );

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
      const data = calculateDevicesUptime(messages, areInactiveDaysIncluded);
      setChartData(data);
    }
  }, [messages, areInactiveDaysIncluded]);

  useEffect(() => {
    if (chartData && devices) {
      const data = calculateConsumption(chartData, devices);
      setConsumptionData(data);
    }
  }, [chartData, devices]);

  const value = {
    devices,
    messages,
    isFetching,
    chartData,
    consumptionData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
