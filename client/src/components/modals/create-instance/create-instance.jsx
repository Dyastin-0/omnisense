import { useState } from "react";
import { setData } from "../../../config/database";
import { useAuth } from "../../../contexts/auth/auth";
import { GenericModal } from "../modal";
import { useData } from "../../../contexts/data/data";

export const CreateInstanceModal = ({
  active,
  closeModal,
  setToastMessage,
  setConfirmEvent,
  setConfirmMessage,
}) => {
  const { user } = useAuth();
  const { instances } = useData();

  const [instanceName, setInstanceName] = useState("");
  const [instanceDescription, setInstanceDescription] = useState("");

  const handleCreateInstance = async (e) => {
    e.preventDefault();

    if (instances.includes(instanceName)) {
      setToastMessage(`Instance ${instanceName} already exists.`);
      return;
    }

    if (!instanceName || !instanceDescription) {
      setToastMessage(`There's an empty field.`);
      return;
    }

    const event = () => {
      return async () => {
        await setData(`${user.uid}/${instanceName}`, {
          description: instanceDescription,
          devices: [],
          messages: [],
          microcontroller: "ESP-32-WROOM 38 Pins",
        });
        setToastMessage(`Instance ${instanceName} created.`);
        setInstanceDescription("");
        setInstanceName("");
      };
    };

    setConfirmEvent(event);
    setConfirmMessage(`Create ${instanceName}?`);
  };

  return (
    <GenericModal
      headerTitle="Create Instance"
      closeModal={closeModal}
      active={active}
      content={
        <form className="column" onSubmit={handleCreateInstance}>
          <input
            value={instanceName}
            placeholder="Instance name"
            onChange={(e) => setInstanceName(e.target.value)}
          />
          <input
            value={instanceDescription}
            placeholder="Instance description"
            onChange={(e) => setInstanceDescription(e.target.value)}
          />
          <button className="nav-button center" type="submit">
            Create Instance
          </button>
        </form>
      }
    />
  );
};
