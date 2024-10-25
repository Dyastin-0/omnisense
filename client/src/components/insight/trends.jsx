import React, { useState, useEffect } from "react";

import { useData } from "../../contexts/data/data";

import { extractHighestUsage } from "../../utils/chart-helper";
import { Loading } from "../loading/loading";

export const Insight = () => {
  const { chartData } = useData();
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const deconstructed = extractHighestUsage(chartData);
      setInsights(deconstructed);
    } else {
      setInsights([]);
    }
  }, [chartData]);

  return (
    <div className="content-panel">
      <h3> Trends </h3>
      <div className="container">
        {insights && insights.length > 0 ? (
          insights.map((value, key) => {
            const highestHours = Math.floor(value.highestUsage);
            const highestMinutes = Math.floor(
              (value.highestUsage - highestHours) * 60
            );
            const highestSeconds = Math.floor(
              ((value.highestUsage - highestHours) * 60 - highestMinutes) * 60
            );
            return (
              <React.Fragment key={key}>
                <div className="message-container">
                  <p className="description center small">{value.date}</p>
                  <p className="message">
                    {value.highestDevice !== null
                      ? `${
                          value.highestDevice
                        } was on for ${highestHours} h ${highestMinutes} m ${highestSeconds} s
                  that is about ${(
                    (value.highestUsage / value.total) *
                    100
                  ).toFixed(0)}% of the total usage.`
                      : `No activity`}
                  </p>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <Loading text="No insights to display." />
        )}
      </div>
    </div>
  );
};
