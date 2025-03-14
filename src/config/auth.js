import { auth } from "./firebase";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  EmailAuthProvider,
  linkWithCredential,
  reload,
} from "firebase/auth";

export const linkAccount = async (user, email, password) => {
  const credential = EmailAuthProvider.credential(email, password);
  return await linkWithCredential(user, credential);
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const updateUser = (user, data) => {
  return updateProfile(user, data);
};

export const reloadUser = (user) => {
  return reload(auth, user);
};

export const logOut = () => {
  return signOut(auth);
};
