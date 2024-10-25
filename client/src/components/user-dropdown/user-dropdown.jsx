import { Dropdown } from "../dropdown/dropdown";

import { logOut } from "../../config/auth";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../button/button";
import { useAuth } from "../../contexts/auth/auth";

export const UserDropdown = ({ openUserProfile, openSettings }) => {
  const { user } = useAuth();
  const [path, setPath] = useState(null);
  const [settingsSpin, setSettingsSpin] = useState("");
  const navigate = useNavigate();

  const settingsRef = useRef(null);

  useEffect(() => {
    const node = settingsRef.current;
    if (node) {
      node.addEventListener("mouseenter", () => setSettingsSpin("fa-spin"));
      node.addEventListener("mouseleave", () => setSettingsSpin(""));
      node.addEventListener("touchstart", () => setSettingsSpin("fa-spin"));
      node.addEventListener("touchend", () => setSettingsSpin(""));
    }
  }, []);

  useEffect(() => {
    path && navigate(path);
  }, [path, navigate]);

  const redirect = (path) => {
    setPath(path);
  };

  return (
    <Dropdown
      name={user && user.displayName}
      content={
        user ? (
          <>
            <Button
              className="nav-button"
              onclick={openUserProfile}
              id="user-profile-button"
              text="Profile"
              icon={<i className="fa-solid fa-user"></i>}
            />
            <Button
              className="nav-button"
              onclick={openSettings}
              ref={settingsRef}
              id="settings-button"
              text="Settings"
              icon={<i className={`fa-solid fa-gear ${settingsSpin}`}></i>}
            />
            <Button
              className="nav-button"
              onclick={logOut}
              id="signout-button"
              text="Sign out"
              icon={<i className="fa-solid fa-right-from-bracket"></i>}
            />
          </>
        ) : (
          <>
            <Button
              className="nav-button"
              id="sign-in-button"
              text="Sign in"
              icon={<i className="fa-solid fa-right-to-bracket"></i>}
              onclick={() => redirect("/sign-in")}
            />
            <Button
              className="nav-button"
              id="sign-in-button"
              text="Sign up"
              icon={<i className="fa-solid fa-user-plus"></i>}
              onclick={() => redirect("/sign-up")}
            />
          </>
        )
      }
    />
  );
};
