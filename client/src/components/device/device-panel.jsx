import "../content-panel.css";

import React, { useState, useEffect } from "react";

import { useData } from "../../contexts/data/data";

import { Loading } from "../loading/loading";
import { useAuth } from "../../contexts/auth/auth";

import { Device } from "./device";

export const DevicePanel = ({ setToastMessage }) => {
  const { devices, isFetching } = useData();
  const { user, userDataPath } = useAuth();
  const [renderedToggles, setRenderedToggles] = useState([]);

  useEffect(() => {
    const renderToggles = () => {
      const rendered = Object.entries(devices).map(([key, value], index) => (
        <Device
          setToastMessage={setToastMessage}
          enabled={value.enabled}
          powerRating={value.powerRating}
          devicePin={value.pin}
          sentBy={`${user?.displayName}`}
          key={key}
          index={key}
          deviceName={value.name}
          icon={
            <i
              className={`fa-solid fa-${value.name.toLowerCase()} ${
                !value.enabled ? "red" : undefined
              }`}
            ></i>
          }
          checked={value.state}
          path={`/${userDataPath}/toggles/${index}/state`}
        />
      ));
      setRenderedToggles(rendered);
    };

    devices && renderToggles();
  }, [devices, user, userDataPath]);

  return (
    <div className="content-panel">
      <h3> Devices </h3>
      <div className="container">
        {!isFetching && renderedToggles.length > 0 ? (
          renderedToggles.map((toggle, index) => (
            <React.Fragment key={index}>{toggle}</React.Fragment>
          ))
        ) : (
          <Loading text="No devices to display." />
        )}
      </div>
    </div>
  );
};
