import { db } from "../config/firebase";
import {
  ref,
  set,
  onValue,
  get,
  query,
  equalTo,
  orderByChild,
  update,
} from "firebase/database";

export async function setData(dataPath, data) {
  const dataRef = ref(db, dataPath);
  await set(dataRef, data).catch((error) => {
    console.error(error);
  });
}

export async function getData(dataPath) {
  const dataRef = ref(db, dataPath);
  const snapShot = await get(dataRef);
  const data = await snapShot.val();
  console.log(data);
  return data;
}

export function listenToChangesOn(dataPath) {
  const dataRef = ref(db, dataPath);
  var newData = null;
  onValue(dataRef, (snapshot) => {
    newData = snapshot.val();
  });

  return newData;
}

export async function pushInArray(dataPath, data) {
  const dataRef = ref(db, dataPath);
  const snapShot = await get(dataRef);
  const messages = (await snapShot.val()) || [];
  messages.push(data);
  set(dataRef, messages);
}

export async function arrayIncludes(dataPath, data) {
  const dataRef = ref(db, dataPath);
  const snapShot = await get(dataRef);
  const toggles = (await snapShot.val()) || [];
  return toggles.some((item) => item.name.includes(data));
}

export async function setQuery(userDataPath, name, key, newState, target) {
  const dataRef = ref(db, userDataPath);
  const queryRef = query(dataRef, orderByChild(name), equalTo(key));

  const res = await get(queryRef);
  const toggleData = res.val();
  const toggleKey = Object.keys(toggleData)[0];
  const toggleRef = ref(db, `/${userDataPath}/${toggleKey}`);
  if (target === "state")
    update(toggleRef, {
      state: newState,
    });

  if (target === "enabled")
    update(toggleRef, {
      enabled: newState,
    });
}
