import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getDatabase } from "@firebase/database";
import { getAnalytics } from "firebase/analytics";

import { firebaseConfig } from "./firebase-config";

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
