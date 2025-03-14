import { setQuery, pushInArray, updateData } from "../config/database";

export const setDeviceState = (userDataPath, name, enabled) => {
  setQuery(`${userDataPath}/devices`, "name", name, enabled, "enabled");
};

export const setToggleState = (userDataPath, name, state, message) => {
  setQuery(`/${userDataPath}/devices`, "name", name, state, "state");
  updateData(`/${userDataPath}/messages`, { [message.timeSent]: message });
};

export const setDeviceName = async (userDataPath, name, newName) => {
  setQuery(`${userDataPath}/devices`, "name", name, newName, "name");
};

export const setPowerRating = async (userDataPath, name, newPowerRating) => {
  setQuery(
    `${userDataPath}/devices`,
    "name",
    name,
    newPowerRating,
    "powerRating"
  );
};

export const setDevicePin = async (userDataPath, name, newPin) => {
  setQuery(`${userDataPath}/devices`, "name", name, newPin, "pin");
};

export const setDeviceSensor = async (userDataPath, name, sensor) => {
  setQuery(`${userDataPath}/devices`, "name", name, sensor, "sensor");
};

export const addDevice = async (
  userDataPath,
  deviceName,
  powerRating,
  devicePin
) => {
  await pushInArray(`/${userDataPath}/devices`, {
    name: deviceName,
    pin: devicePin,
    powerRating: powerRating,
    enabled: false,
    state: 0,
  });
};

export const addInstance = async (userPath, deviceName) => {
  console.log(userPath, deviceName);
  await pushInArray(`/${userPath}/instances`, deviceName);
};

export const cacheComputedData = (userPath, data) => {
  updateData(`${userPath}/cachedComputedData`, data);
};

export const cacheComputedUptime = async (userPath, data) => {
  updateData(`${userPath}/cachedComputedUptime`, data);
};
