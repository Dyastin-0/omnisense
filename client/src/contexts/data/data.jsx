import React, { createContext, useContext, useEffect, useState } from "react";

import { onValue, ref, query, orderByChild, startAt } from "firebase/database";

import { db } from "../../config/firebase";
import { useAuth } from "../auth/auth";
import {
  calculateConsumptionAndCost,
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
  const [consumptionAndCostData, setConsumptionAndCostData] = useState([]);
  const [instances, setInstances] = useState(["Default"]);
  const [microcontroller, setMicrocontroller] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const instancesRef = ref(db, `/${user.uid}`);
      onValue(instancesRef, (snapshot) => {
        setInstances(Object.keys(snapshot.val()).filter(((val) => val !== "instances")) || []);
      });

      const instanceRef = ref(db, `/${userDataPath}`);
      onValue(instanceRef, (snapshot) => {
        setMicrocontroller(snapshot.val()?.microcontroller);
      });

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
      const data = calculateConsumptionAndCost(chartData, devices);
      setConsumptionAndCostData(data);
    }
  }, [chartData, devices]);

  const value = {
    devices,
    messages,
    isFetching,
    chartData,
    consumptionAndCostData,
    instances,
    microcontroller,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
