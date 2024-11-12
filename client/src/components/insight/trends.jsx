import React, { useState, useEffect } from "react";

import { useData } from "../../contexts/data/data";

import { extractHighestUsage } from "../../utils/chart-helper";
import { Loading } from "../loading/loading";

export const Trends = () => {
  const { currentMonthData, devices } = useData();
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (currentMonthData?.days?.length > 0) {
      const deconstructed = extractHighestUsage(currentMonthData.days, devices);
      setInsights(deconstructed);
    }
  }, [currentMonthData, devices]);

  return (
    <div className="content-panel">
      <h3> Trends </h3>
      <div className="container">
        {insights && insights.length > 0 ? (
          insights.map((value, key) => {
            const highestHours = Math.floor(value.highest.usage);
            const highestMinutes = Math.floor(
              (value.highest.usage - highestHours) * 60
            );
            const highestSeconds = Math.floor(
              ((value.highest.usage - highestHours) * 60 - highestMinutes) * 60
            );
            return (
              <React.Fragment key={key}>
                <div className="message-container">
                  <p className="description center small">{value.date}</p>
                  {value.highest.name ? (
                    <>
                      <p className="message">
                        {`\u2022 ${
                          value.highest.name
                        } was on for ${highestHours} h ${highestMinutes} m ${highestSeconds} s
                  that is about ${(
                    (value.highest.usage / value.total.usage) *
                    100
                  ).toFixed(
                    0
                  )}% of the total usage. It consumed ${value.highest.consumption.toFixed(
                          2
                        )} kWh and costs about \u20B1${value.highest.cost.toFixed(
                          2
                        )}.`}
                      </p>
                      <p className="message">
                        {`\u2022 The total consumption ${
                          value.date !== "Today" ? "was" : "is"
                        } ${value.total.consumption.toFixed(
                          2
                        )} kWh and costs about \u20B1${value.total.cost.toFixed(
                          2
                        )}.`}
                      </p>
                    </>
                  ) : (
                    <p className="message">No insights to display.</p>
                  )}
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
