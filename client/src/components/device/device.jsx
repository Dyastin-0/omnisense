import { memo } from "react";

import Toggle from "../toggle/toggle";
import { Button } from "../button/button";
import { DeviceSettings } from "../modals/device-settings/device-settings";

import { setToggleState, setDeviceState } from "../../utils/data-helper";
import { useState, useCallback } from "react";
import { useAuth } from "../../contexts/auth/auth";

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.deviceName === nextProps.deviceName &&
    prevProps.enabled === nextProps.enabled &&
    prevProps.index === nextProps.index
  );
};

export const Device = memo(
  ({
    deviceName,
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
    const [state, setState] = useState(checked);
    const [deviceEnabled, setDeviceEnabled] = useState(enabled);

    const openSettings = useCallback(() => setIsSettingsOpen(true), []);
    const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

    const handleStateChange = useCallback(
      (newState) => {
        if (!deviceEnabled) {
          setToastMessage(`${deviceName} is disabled.`);
          return;
        }
        setState(newState);
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
      },
      [deviceEnabled, deviceName, sentBy, setToastMessage, userDataPath]
    );

    const handleDeviceState = useCallback(
      (newState) => {
        if (state) {
          setToastMessage(`${deviceName} is on, turn it off first.`);
          return;
        }
        setDeviceEnabled(newState);
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
      },
      [deviceName, sentBy, setToastMessage, state, userDataPath]
    );

    return (
      <div className="sub-container disabled">
        <div className="row">
          <p>{`${index}.`}</p>
          <p className="description"> {deviceName} </p>
          {icon}
        </div>
        <div className="row">
          <Toggle checked={state} onChange={handleStateChange} />
          <Button
            className="nav-button"
            onclick={openSettings}
            icon={<i className="fa-solid fa-ellipsis-vertical"></i>}
          />
          <DeviceSettings
            handleDeviceState={handleDeviceState}
            enabled={deviceEnabled}
            devicePin={devicePin}
            index={index}
            active={isSettingsOpen}
            closeModal={closeSettings}
            deviceName={deviceName}
          />
        </div>
      </div>
    );
  },
  areEqual
);
