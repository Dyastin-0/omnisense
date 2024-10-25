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
import { CustomTooltip } from "./custom-tooltip";
import { useSettings } from "../../../contexts/settings/settings";

export const UsageChart = () => {
  const { devices, messages, chartData } = useData();
  const { areDevicesIncluded } = useSettings();
  const [renderedAreas, setRenderedAreas] = useState([]);

  useEffect(() => {
    const renderAreas = () => {
      const rendered = Object.entries(devices).map(([key, value], index) => {
        return (
          <Area
            key={index}
            type="monotone"
            dataKey={value.name}
            stroke="var(--accent)"
            fill="var(--accent)"
          />
        );
      });
      setRenderedAreas(rendered);
    };

    messages && devices && renderAreas();
  }, [messages, devices]);

  return (
    <div className="content-panel">
      <h3> Usage </h3>
      <div className="container">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="98%">
            <AreaChart
              width="100%"
              height="100%"
              data={chartData}
              margin={{ right: 30 }}
            >
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1) {
                    return `${value} h`;
                  } else if (value < 0.006) {
                    return `${(value * 3600).toFixed(2)} s`;
                  } else {
                    return `${(value * 60).toFixed(2)} m`;
                  }
                }}
              />
              <XAxis dataKey="date" />
              <CartesianGrid />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
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
