import { useSettings } from "../../../contexts/settings/settings";
import { GenericModal } from "../modal";
import Toggle from "../../toggle/toggle";
import { Dropdown } from "../../dropdown/dropdown";
import { useData } from "../../../contexts/data/data";
import { Button } from "../../button/button";

export const SettingsModal = ({ active, closeModal, setToastMessage }) => {
  const {
    theme,
    toggleTheme,
    toggleIncludeDevice,
    areDevicesIncluded,
    toggleIncludeInactiveDays,
    areInactiveDaysIncluded,
    setSelectedInstance,
    selectedInstance,
  } = useSettings();
  const { instances, microcontroller } = useData();

  return (
    <GenericModal
      width={"224px"}
      headerTitle="Settings"
      active={active}
      closeModal={closeModal}
      content={
        <div className="modal-content-container">
          <p className="description">General</p>
          <div className="row left">
            <Dropdown name="Select">
              {instances?.map((instance, index) => (
                <Button
                  className="nav-button"
                  onclick={() => {
                    if (instance === selectedInstance) {
                      setToastMessage(`Instance already set to ${instance}.`);
                      return;
                    }
                    setSelectedInstance(instance);
                    setToastMessage(`Instance set to ${instance}.`);
                  }}
                  key={index}
                  text={instance}
                />
              ))}
            </Dropdown>
            <p>Instance</p>
          </div>
          <div className="row left">
            <Toggle
              checked={theme === "dark"}
              size="small"
              onChange={toggleTheme}
            />
            <p>Dark mode</p>
          </div>
          <p className="description">Chart</p>
          <div className="row left">
            <Toggle
              checked={areDevicesIncluded}
              size="small"
              onChange={toggleIncludeDevice}
            />
            <p>Include devices</p>
          </div>
          <div className="row left">
            <Toggle
              checked={areInactiveDaysIncluded}
              size="small"
              onChange={toggleIncludeInactiveDays}
            />
            <p>Include inactive days</p>
          </div>
          <p className="description">Microcontroller</p>
          <h5>{microcontroller}</h5>
        </div>
      }
    />
  );
};
