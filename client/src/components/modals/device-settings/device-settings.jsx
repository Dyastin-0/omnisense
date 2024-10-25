import Toggle from "../../toggle/toggle";
import { GenericModal } from "../modal";

export const DeviceSettings = ({
  deviceName,
  enabled,
  handleDeviceState,
  devicePin,
  active,
  closeModal,
  index,
  powerRating,
}) => {
  return (
    <GenericModal
      width="150px"
      active={active}
      closeModal={closeModal}
      headerTitle={`${deviceName}`}
      content={
        <div className="modal-content-container">
          <div className="column flex">
            <div>
              <p className="description">Name</p>
              <p>{deviceName}</p>
            </div>
            <div>
              <p className="description">Power Rating</p>
              <p>{`${powerRating} W`}</p>
            </div>
            <div>
              <p className="description">Pin</p>
              <p>{devicePin}</p>
            </div>
            <div>
              <p className="description">Index</p>
              <p>{index}</p>
            </div>
          </div>
          <div>
            <p className="description">Icon</p>
            <i className={`fa-solid fa-${deviceName.toLowerCase()}`}></i>
          </div>
          <div>
            <p className="description">Enable</p>
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
