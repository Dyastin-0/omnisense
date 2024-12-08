import { useState } from "react";
import { Button } from "../../button/button";
import { Dropdown } from "../../dropdown/dropdown";
import { GenericModal } from "../modal";
import { sensorGpioPins } from "../../../models/gpio";
import { useData } from "../../../contexts/data/data";
import { setDeviceSensor } from "../../../utils/data-helper";
import { useAuth } from "../../../contexts/auth/auth";

const sensors = [
  {
    name: "Sound sensor (KY-038)",
    pins: ["AO", "DO"],
  },
  {
    name: "Motion sensor (HC-SR501)",
    pins: ["DO"],
  },
];

const IntegrateSensorModal = ({ active, closeModal, deviceName }) => {
  const { devices } = useData();
  const { userDataPath } = useAuth();
  const [sensor, setSensor] = useState(null);
  const [selectedPins, setSelectedPins] = useState([]);

  const handleSetSensor = () => {
    if (!sensor || selectedPins.length !== sensor.pins.length) {
      console.log(selectedPins.length, sensor.pins);
      return;
    }

    setDeviceSensor(userDataPath, deviceName, {
      name: sensor.name,
      pins: selectedPins,
    }).then(() => closeModal());
  };

  return (
    <GenericModal
      width="200px"
      headerTitle={`Integrate sensor to ${deviceName}`}
      closeModal={closeModal}
      active={active}
      content={
        <div className="modal-content-container">
          <div className="column flex">
            <Dropdown name="Sensors">
              {sensors.map((sensor) => (
                <Button
                  key={sensor.name}
                  text={sensor.name}
                  className="nav-button"
                  onclick={() => {
                    setSensor(sensor);
                    setSelectedPins([]);
                  }}
                />
              ))}
            </Dropdown>
            <div>
              <p className="description">Selected</p>
              <p>{sensor ? sensor.name : "None"}</p>
              {sensor && (
                <Dropdown name="Select pins">
                  {sensorGpioPins
                    .filter(
                      (pin) =>
                        !devices.some((device) =>
                          device?.sensor?.pins?.some((s) => s?.pin === pin)
                        ) && !selectedPins.some((p) => p.pin === pin)
                    )
                    .map((pin) => (
                      <Button
                        key={pin}
                        text={pin}
                        className="nav-button"
                        onclick={() => {
                          setSelectedPins((prev) => {
                            const nextTypeIndex =
                              prev.length % sensor.pins.length;
                            const nextType = sensor.pins[nextTypeIndex];

                            if (prev.some((p) => p.pin === pin)) {
                              return prev;
                            }

                            const newPin = { pin, type: nextType };

                            if (prev.length === sensor.pins.length) {
                              console.log(newPin);
                              return [newPin, ...prev.slice(1)];
                            }

                            return [...prev, newPin];
                          });
                        }}
                      />
                    ))}
                </Dropdown>
              )}
              {selectedPins.length > 0 && (
                <div>
                  <p className="description">Selected pins</p>
                  <div className="row left">
                    {selectedPins.map((pin) => (
                      <p key={pin.pin}>
                        Pin {pin.pin} - {pin.type}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              text="Set"
              className="nav-button center"
              onclick={handleSetSensor}
            />
          </div>
        </div>
      }
    />
  );
};

export default IntegrateSensorModal;
