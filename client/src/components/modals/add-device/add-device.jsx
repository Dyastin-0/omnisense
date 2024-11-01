import { arrayIncludes } from "../../../config/database";
import { useState } from "react";
import { GenericModal } from "../modal";
import { addDevice } from "../../../utils/data-helper";
import { useAuth } from "../../../contexts/auth/auth";

export const AddDeviceModal = ({
  path,
  setToastMessage,
  setConfirmEvent,
  setConfirmMessage,
  closeModal,
  active,
}) => {
  const { userDataPath } = useAuth();

  const [deviceName, setDeviceName] = useState(null);
  const [devicePin, setDevicePin] = useState(null);
  const [powerRating, setPowerRating] = useState(null);

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
          await addDevice(userDataPath, deviceName, devicePin, powerRating);
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
            onChange={(e) => setDeviceName(e.target.value)}
          />
          <input
            placeholder="Power Rating (Wattage)"
            onChange={(e) => setDevicePin(e.target.value)}
          />
          <input
            placeholder="Pin number"
            onChange={(e) => setPowerRating(e.target.value)}
          />
          <button className="nav-button center" type="submit">
            Add Device
          </button>
        </form>
      }
    />
  );
};
