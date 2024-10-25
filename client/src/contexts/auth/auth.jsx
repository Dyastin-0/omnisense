import React, { useEffect, useState, useContext, createContext } from "react";

import { auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { SplashScreen } from "../../components/splash-screen/splash-screen";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
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
  }, []);

  const initializeUser = async (user) => {
    if (user) {
      setIsLinked(
        user.providerData.some((provider) => provider.providerId === "password")
      );
      setUser(user);
      setUserDataPath(`/${user.uid}`);
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
