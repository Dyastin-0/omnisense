import React, { useEffect, useState } from "react";
import { useData } from "../../../contexts/data/data";
import {
  calculateConsumptionAndCost,
  calculateDevicesUptime,
  divideDataByMonth,
} from "../../../utils/chart-helper";
import { Loading } from "../../loading/loading";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SummaryTooltip } from "./summary-tooltip";

const SummaryChart = () => {
  const { months } = useData();

  return (
    <div className="content-panel flex-max">
      <h3> Monthly Summary </h3>
      <div className="container">
        {months ? (
          <ResponsiveContainer width="100%" height="98%">
            <AreaChart
              width="100%"
              height="100%"
              data={months}
              margin={{ right: 30 }}
            >
              <YAxis tickFormatter={(value) => `\u20B1${value}`} />
              <XAxis dataKey="month" />
              <CartesianGrid />
              <Tooltip content={<SummaryTooltip />} />
              <Area
                type="monotone"
                dataKey="total.cost"
                name="Cost"
                stroke="var(--accent)"
                fill="var(--accent)"
              />
              <Area
                type="monotone"
                dataKey="total.consumption"
                name="Consumption"
                stroke="var(--secondary-accent)"
                fill="var(--secondary-accent)"
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Loading text="No data to display." />
        )}
      </div>
    </div>
  );
};

export default SummaryChart;
