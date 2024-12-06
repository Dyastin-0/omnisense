import { useState } from "react";
import { GenericModal } from "../modal";
import Toggle from "../../toggle/toggle";
import { Button } from "../../button/button";
import { gpioPins } from "../../../models/gpio";
import { Dropdown } from "../../dropdown/dropdown";
import { useData } from "../../../contexts/data/data";
import {
  setDeviceName,
  setDevicePin,
  setPowerRating,
} from "../../../utils/data-helper";
import { useAuth } from "../../../contexts/auth/auth";

export const DeviceSettings = ({
  active,
  closeModal,
  deviceName,
  powerRating,
  devicePin,
  enabled,
  sensor,
  handleDeviceState,
  setToastMessage,
  openSensor,
}) => {
  const { devices } = useData();
  const { userDataPath } = useAuth();

  const [nameFocused, setNameFocused] = useState(false);
  const [powerFocused, setPowerFocused] = useState(false);

  const [name, setName] = useState("");
  const [power, setPower] = useState("");

  const handleModifyName = () => {
    if (deviceName === name) {
      setToastMessage("Name is unchanged.");
      return;
    }

    if (devices.some((device) => device.name === name)) {
      setToastMessage("Name is already used.");
      return;
    }

    setDeviceName(userDataPath, deviceName, name)
      .then(() => setToastMessage(`Name changed to ${name}.`))
      .catch((error) => console.error(error));
  };

  const handleModifyPower = () => {
    if (powerRating === power) {
      setToastMessage("Power rating is unchanged.");
      return;
    }

    setPowerRating(userDataPath, deviceName, power)
      .then(() => setToastMessage(`Power rating changed to ${power}.`))
      .catch((error) => console.error(error));
  };

  const handleModifyPin = (e) => {
    const newPin = e.target.textContent.trim();
    setDevicePin(userDataPath, deviceName, newPin)
      .then(() => setToastMessage(`Pin changed to ${newPin}.`))
      .catch(() => console.error(error));
  };

  return (
    <GenericModal
      width="150px"
      active={active}
      closeModal={() => {
        closeModal();
        setName("");
        setPower("");
      }}
      headerTitle={`${deviceName}`}
      content={
        <div className="modal-content-container">
          <div className="column flex">
            <div>
              <p className="description">Name</p>
              <div className="row">
                <input
                  className="medium"
                  type="text"
                  value={nameFocused ? name : deviceName}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
                <Button
                  icon={<i className="fa-solid fa-edit" />}
                  className="nav-button center"
                  onclick={handleModifyName}
                />
              </div>
            </div>
            <div>
              <p className="description">Power Rating</p>
              <div className="row">
                <input
                  type="text"
                  value={powerFocused ? power : powerRating}
                  onChange={(e) => setPower(e.target.value)}
                  onFocus={() => setPowerFocused(true)}
                  onBlur={() => setPowerFocused(false)}
                />
                <Button
                  icon={<i className="fa-solid fa-edit" />}
                  className="nav-button center"
                  onclick={handleModifyPower}
                />
              </div>
            </div>
            <div>
              <p className="description">Pin</p>
              <Dropdown className="small" name={devicePin}>
                {devices &&
                  gpioPins
                    .filter(
                      (pin) => !devices.some((device) => device.pin == pin)
                    )
                    .map((pin) => (
                      <Button
                        key={pin}
                        text={pin}
                        onclick={handleModifyPin}
                        className="nav-button center"
                        type="button"
                      />
                    ))}
              </Dropdown>
              <div>
                <p className="description">Sensor</p>
                {sensor ? (
                  <>
                    <p>{sensor.name}</p>
                    <div className="row left">
                      {sensor.pins.map((value) => (
                        <p key={value.pin}>
                          {value.pin} - {value.type}
                        </p>
                      ))}
                    </div>
                    <Button
                      text="Modify sensor"
                      className="nav-button center full"
                      onclick={() => {
                        openSensor();
                        closeModal();
                      }}
                    />
                  </>
                ) : (
                  <Button
                    text="Integrate a sensor"
                    className="nav-button center full"
                    icon={<i className="fa-solid fa-wifi" />}
                    onclick={() => {
                      openSensor();
                      closeModal();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="description">{enabled ? "enabled" : "enable"}</p>
            <Toggle
              checked={enabled}
              onChange={handleDeviceState}
              size="small"
            />
          </div>
        </div>
      }
    />
  );
};
