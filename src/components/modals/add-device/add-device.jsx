import { arrayIncludes } from "../../../config/database";
import { useState } from "react";
import { GenericModal } from "../modal";
import { addDevice } from "../../../utils/data-helper";
import { useAuth } from "../../../contexts/auth/auth";
import { useData } from "../../../contexts/data/data";
import { Dropdown } from "../../dropdown/dropdown";
import { gpioPins } from "../../../models/gpio";
import { Button } from "../../button/button";

export const AddDeviceModal = ({
  path,
  setToastMessage,
  setConfirmEvent,
  setConfirmMessage,
  closeModal,
  active,
}) => {
  const { userDataPath } = useAuth();
  const { devices } = useData();

  const [deviceName, setDeviceName] = useState("");
  const [devicePin, setDevicePin] = useState("");
  const [powerRating, setPowerRating] = useState("");

  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!deviceName || !devicePin || !powerRating) {
      setToastMessage(`There's an empty field.`);
      return;
    }
    const includes = await arrayIncludes(`${path}/devices`, deviceName);
    if (includes) {
      setToastMessage(`${deviceName} is already used.`);
    } else {
      const event = () => {
        return async () => {
          await addDevice(userDataPath, deviceName, powerRating, devicePin);
          setToastMessage(`Device ${deviceName.toLocaleLowerCase()} added.`);
          setDeviceName("");
          setDevicePin("");
          setPowerRating("");
          closeModal();
        };
      };
      setConfirmEvent(event);
      setConfirmMessage(`Add ${deviceName}?`);
    }
  };

  return (
    <GenericModal
      headerTitle="Add device"
      closeModal={closeModal}
      active={active}
      content={
        <form className="column" onSubmit={handleAddDevice}>
          <input
            placeholder="Device name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
          <input
            placeholder="Power Rating (Wattage)"
            value={powerRating}
            onChange={(e) => setPowerRating(e.target.value)}
          />
          <div className="row left">
            <p>GPIO</p>
            <Dropdown className="small" name={devicePin}>
              {devices &&
                gpioPins
                  .filter((pin) => !devices.some((device) => device.pin == pin))
                  .map((pin) => (
                    <Button
                      key={pin}
                      text={pin}
                      className="nav-button center"
                      type="button"
                      onclick={(e) => {
                        e.preventDefault();
                        setDevicePin(pin);
                      }}
                    />
                  ))}
            </Dropdown>
          </div>
          <button className="nav-button center" type="submit">
            Add Device
          </button>
        </form>
      }
    />
  );
};
