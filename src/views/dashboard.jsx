import "../App.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/auth";
import { useEffect, useLayoutEffect } from "react";

import { DevicePanel } from "../components/device/device-panel";
import { MessagePanel } from "../components/log/log-panel";
import { UsageChart } from "../components/insight/charts/usage-chart";
import { Pad } from "../components/Pad/Pad";
import { Trends } from "../components/insight/trends";
import { ConsumptionChart } from "../components/insight/charts/consumption-chart";
import { CostChart } from "../components/insight/charts/cost-chart";
import Insights from "../components/insight/insights";
import { useSettings } from "../contexts/settings/settings";
import SummaryChart from "../components/insight/charts/summary-chart";

const Dashboard = ({ setToastMessage }) => {
  const navigate = useNavigate();
  const { selectedInstance } = useSettings();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    !isLoggedIn && navigate("/sign-in");
  }, [isLoggedIn, navigate]);

  useLayoutEffect(() => {
    document.title = `Omnisense/${isLoggedIn && user.displayName}`;
  });

  useEffect(() => {
    setToastMessage("Welcome.");
  }, []);

  return (
    <main>
      <Pad
        options={{ panel: "flex-max small", container: "center" }}
        content={<h2>{`${selectedInstance} Instance`}</h2>}
      />
      <UsageChart />
      <ConsumptionChart />
      <CostChart />
      <Trends />
      <DevicePanel setToastMessage={setToastMessage} />
      {/* <Insights /> */}
      <MessagePanel />
      <SummaryChart />
      <Pad options={{ panel: "flex-max small" }} />
    </main>
  );
};

export default Dashboard;
