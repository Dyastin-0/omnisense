import { setQuery, pushInArray } from "../config/database";

export const setDeviceState = (userDataPath, name, enabled, message) => {
  setQuery(`${userDataPath}/devices`, "name", name, enabled, "enabled");
};

export const setToggleState = (userDataPath, name, state, message) => {
  setQuery(`/${userDataPath}/devices`, "name", name, state, "state");
  pushInArray(`/${userDataPath}/messages`, message);
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
