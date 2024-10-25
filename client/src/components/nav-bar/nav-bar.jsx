import "./nav-bar.css";

import { React, useEffect, useState } from "react";

import { UserDropdown } from "../user-dropdown/user-dropdown";
import { Button } from "../button/button";
import { HelpModal } from "../modals/help/help";
import { UserProfile } from "../modals/profile/profile";
import { ToastMessage } from "../modals/toast-message/toast-message";
import { ConfirmDialogModal } from "../modals/confirm-dialog/confirm-dialog";
import { InfoModal } from "../modals/info/info";
import { useAuth } from "../../contexts/auth/auth";
import { SettingsModal } from "../modals/settings/settings-modal";
import { AccountLinking } from "../modals/account-linking/account-linking";
import { AddDeviceModal } from "../modals/add-device/add-device";

export const NavBar = ({ toastMessage, setToastMessage }) => {
  const { isLoggedIn, isLinked, userDataPath } = useAuth();
  const [isHelpClicked, setIsHelpClicked] = useState(false);
  const [isInfoClicked, setIsInfoClicked] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAccountLinkingOpen, setIsAccountLinkingOpen] = useState(false);
  const [accountLinkReminder, setAccountLinkReminder] = useState(0);

  const [confirmEvent, setConfirmEvent] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);

  const closeAddDeviceModal = () => setIsAddDeviceOpen(false);
  const openAddDeviceModal = () => setIsAddDeviceOpen(true);

  const closeAccountLinking = () => {
    const currentDate = new Date().getTime();
    const reminder = currentDate + 2 * 60 * 60 * 1000;
    localStorage.setItem("accountLinkReminder", String(reminder));
    setIsAccountLinkingOpen(false);
  };

  useEffect(() => {
    const reminder = localStorage.getItem("accountLinkReminder");
    reminder && setAccountLinkReminder(parseInt(reminder));
  }, []);

  useEffect(() => {
    setIsAccountLinkingOpen(!isLinked);
  }, [isLinked, setIsAccountLinkingOpen]);

  const handleHelpClick = () => {
    localStorage.setItem("isHelpClicked", true);
    setIsHelpClicked(true);
  };
  const closeHelpModal = () => setIsHelpModalOpen(false);
  const openHelpModal = () => {
    setIsHelpModalOpen(true);
    handleHelpClick();
  };
  useEffect(() => {
    setIsHelpClicked(localStorage.getItem("isHelpClicked"));
  }, []);

  const handleInfoClick = () => {
    localStorage.setItem("isInfoClicked", true);
    setIsInfoClicked(true);
  };
  const closeInfoModal = () => setIsInfoModalOpen(false);
  const openInfoModal = () => {
    setIsInfoModalOpen(true);
    handleInfoClick();
  };
  useEffect(() => {
    setIsInfoClicked(localStorage.getItem("isInfoClicked"));
  }, []);

  const closeUserProfile = () => setIsUserProfileOpen(false);
  const openUserProfile = () => setIsUserProfileOpen(true);

  const closeSettings = () => setIsSettingsModalOpen(false);
  const openSettings = () => setIsSettingsModalOpen(true);

  return (
    <div className="nav-bar">
      <i className="fa-solid fa-toggle-on fa-2x"></i>
      <div className="row">
        <div className="row no-gap">
          <Button
            className="nav-button round"
            onclick={openInfoModal}
            icon={
              <i
                className={`fa-solid fa-circle-info fa-xl ${
                  !isInfoClicked ? "fa-bounce" : undefined
                }`}
              ></i>
            }
          />
          <Button
            className="nav-button round"
            onclick={openHelpModal}
            icon={
              <i
                className={`fa-solid fa-circle-question fa-xl ${
                  !isHelpClicked ? "fa-bounce" : undefined
                }`}
              ></i>
            }
          />
          {isLoggedIn && (
            <Button
              className="nav-button round fixed"
              icon={<i className="fa-solid fa-circle-plus fa-xl fa-bounce"></i>}
              onclick={openAddDeviceModal}
            />
          )}
        </div>
        <UserDropdown
          openSettings={openSettings}
          openUserProfile={openUserProfile}
        />
      </div>
      <HelpModal active={isHelpModalOpen} closeModal={closeHelpModal} />
      <InfoModal active={isInfoModalOpen} closeModal={closeInfoModal} />
      {isLoggedIn && (
        <UserProfile active={isUserProfileOpen} closeModal={closeUserProfile} />
      )}
      <ConfirmDialogModal
        closeModal={() => false}
        setToastMessage={setToastMessage}
        event={confirmEvent}
        message={confirmMessage}
      />
      <ToastMessage message={toastMessage} setToastMessage={setToastMessage} />
      {isLoggedIn && (
        <SettingsModal
          active={isSettingsModalOpen}
          closeModal={closeSettings}
        />
      )}
      {!(new Date().getTime() < accountLinkReminder) &&
        isLoggedIn &&
        !isLinked && (
          <AccountLinking
            closeModal={closeAccountLinking}
            setToastMessage={setToastMessage}
            active={isAccountLinkingOpen}
          />
        )}
      {isLoggedIn && (
        <AddDeviceModal
          setConfirmEvent={setConfirmEvent}
          setConfirmMessage={setConfirmMessage}
          setToastMessage={setToastMessage}
          active={isAddDeviceOpen}
          closeModal={closeAddDeviceModal}
          path={userDataPath}
        />
      )}
    </div>
  );
};
