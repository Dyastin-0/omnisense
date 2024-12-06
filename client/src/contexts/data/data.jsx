import React, { createContext, useContext, useEffect, useState } from "react";

import {
  onValue,
  ref,
  query,
  orderByChild,
  startAt,
  endAt,
  get,
} from "firebase/database";

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
  const [cachedComputedData, setCachedComputedData] = useState(null);
  const [cachedUptimeData, setCachedUptimeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const instancesRef = ref(db, `/${user.uid}`);
      onValue(instancesRef, (snapshot) => {
        setInstances(
          Object.keys(snapshot.val()).filter((val) => val !== "instances") || []
        );
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

      onValue(messagesRef, (snapshot) => {
        const messages = snapshot.val() || [];
        setMessages(messages);
      });

      onValue(messagesRef, (snapshot) => {
        const messages = Object.values(snapshot.val() || {});
        setMessages(messages);
      });

      const uptimeDataRef = ref(db, `/${userDataPath}/cachedComputedUptime`);

      get(uptimeDataRef).then((snapshot) => {
        setCachedUptimeData(snapshot.val() || {});
      });

      const previouslyComputedDataRef = ref(
        db,
        `${userDataPath}/cachedComputedData`
      );

      get(previouslyComputedDataRef).then((snapshot) => {
        setCachedComputedData(snapshot.val() || {});
      });
    };
    user && fetchData();
  }, [user, userDataPath]);

  useEffect(() => {
    setIsFetching(!(devices !== null) && messages !== null);
  }, [devices, messages]);

  useEffect(() => {
    if (messages && cachedComputedData && cachedUptimeData) {
      const date = new Date();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      setCurrentMonth(key);

      const months = divideDataByMonth(messages);

      const data = Object.entries(months).map(([key, value]) => {
        return {
          month: key,
          data: calculateDevicesUptime(
            value,
            cachedUptimeData,
            areInactiveDaysIncluded,
            userDataPath
          ),
        };
      });

      setMonthsUptime(data);

      const monthsData = data.map((month) => {
        return {
          month: month.month,
          ...calculateConsumptionAndCost(
            month.data,
            devices,
            10.12,
            cachedComputedData,
            userDataPath
          ),
        };
      });

      setCurrentMonthData(monthsData.find((month) => month.month === key));
      setMonths(monthsData);
    }
  }, [messages, cachedComputedData, cachedUptimeData, areInactiveDaysIncluded]);

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
