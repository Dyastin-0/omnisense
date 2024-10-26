import React, { useEffect, useState } from "react";
import "../../content-panel.css";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useData } from "../../../contexts/data/data";
import { Loading } from "../../loading/loading";
import { useSettings } from "../../../contexts/settings/settings";
import { ConsumptionTooltip } from "./consumption-tooltip";

export const ConsumptionChart = () => {
  const { devices, consumptionAndCostData } = useData();
  const { areDevicesIncluded } = useSettings();
  const [renderedAreas, setRenderedAreas] = useState([]);

  useEffect(() => {
    if (devices) {
      const rendered = Object.entries(devices).map(([key, value], index) => (
        <Area
          key={index}
          type="monotone"
          dataKey={`${value.name}.consumption`}
          stroke="var(--accent)"
          fill="var(--accent)"
        />
      ));

      setRenderedAreas(rendered);
    }
  }, [devices, consumptionAndCostData]);

  return (
    <div className="content-panel">
      <h3> Consumption </h3>
      <div className="container">
        {consumptionAndCostData.length > 0 ? (
          <ResponsiveContainer width="100%" height="98%">
            <AreaChart
              width="100%"
              height="100%"
              data={consumptionAndCostData}
              margin={{ right: 30 }}
            >
              <YAxis tickFormatter={(value) => `${value} kWh`} />
              <XAxis dataKey="date" />
              <CartesianGrid />
              <Tooltip content={<ConsumptionTooltip />} />
              <Area
                type="monotone"
                dataKey="Total.consumption"
                stroke="var(--accent)"
                fill="var(--accent)"
              />
              {areDevicesIncluded &&
                renderedAreas.length > 0 &&
                renderedAreas.map((area, index) => (
                  <React.Fragment key={index}>{area}</React.Fragment>
                ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Loading text="No data to display." />
        )}
      </div>
    </div>
  );
};
