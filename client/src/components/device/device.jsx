import Toggle from "../toggle/toggle";
import { Button } from "../button/button";
import { DeviceSettings } from "../modals/device-settings/device-settings";

import { setToggleState, setDeviceState } from "../../utils/data-helper";
import { useState, useCallback } from "react";
import { useAuth } from "../../contexts/auth/auth";

export const Device = ({
  deviceName,
  powerRating,
  enabled,
  devicePin,
  sentBy,
  icon,
  index,
  checked,
  setToastMessage,
}) => {
  const { userDataPath } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const handleStateChange = (newState) => {
    if (!enabled) {
      setToastMessage(`${deviceName} is disabled.`);
      return;
    }
    const action = newState ? "on" : "off";
    const message = {
      actionType: "stateToggle",
      action: action,
      name: deviceName,
      sentBy: sentBy,
      message: `turned ${action} the ${deviceName}.`,
      timeSent: new Date().getTime(),
    };
    setToggleState(userDataPath, deviceName, newState, message);
  };

  const handleDeviceState = (newState) => {
    if (checked) {
      setToastMessage(`${deviceName} is on, turn it off first.`);
      return;
    }
    const action = newState ? "enabled" : "disabled";
    const message = {
      action: action,
      name: deviceName,
      sentBy: sentBy,
      message: `${action} the ${deviceName}.`,
      timeSent: new Date().getTime(),
    };
    setDeviceState(userDataPath, deviceName, newState, message);
    setToastMessage(`${deviceName} ${action}.`);
  };
  return (
    <div className="sub-container disabled">
      <div className="row">
        <p>{`${index}.`}</p>
        <p className="description"> {deviceName} </p>
        {icon}
      </div>
      <div className="row">
        <Toggle checked={checked} onChange={handleStateChange} />
        <Button
          className="nav-button"
          onclick={openSettings}
          icon={<i className="fa-solid fa-ellipsis-vertical"></i>}
        />
        <DeviceSettings
          handleDeviceState={handleDeviceState}
          enabled={enabled}
          devicePin={devicePin}
          powerRating={powerRating}
          index={index}
          active={isSettingsOpen}
          closeModal={closeSettings}
          deviceName={deviceName}
        />
      </div>
    </div>
  );
};
