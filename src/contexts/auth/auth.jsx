import React, { useEffect, useState, useContext, createContext } from "react";

import { auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { SplashScreen } from "../../components/splash-screen/splash-screen";
import { useSettings } from "../settings/settings";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const { selectedInstance } = useSettings();
  const [user, setUser] = useState(null);
  const [userDataPath, setUserDataPath] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      initializeUser(user)
    );
    return unsubscribe;
  }, [selectedInstance]);

  const initializeUser = async (user) => {
    if (user) {
      setIsLinked(
        user.providerData.some((provider) => provider.providerId === "password")
      );
      setUser(user);
      setUserDataPath(`/${user.uid}/${selectedInstance}`);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };

  const value = {
    user,
    userDataPath,
    isLoggedIn,
    isLoading,
    isLinked,
    setIsLinked,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <SplashScreen />}
    </AuthContext.Provider>
  );
}
