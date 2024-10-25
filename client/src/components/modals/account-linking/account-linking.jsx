import "../../auth/auth.css";

import { useState, useEffect } from "react";

import { GenericModal } from "../modal";
import { linkAccount } from "../../../config/auth";
import { useAuth } from "../../../contexts/auth/auth";
import { Button } from "../../button/button";

import { evaluatePasswordStrength } from "../../../utils/password-meter";

export const AccountLinking = ({ setToastMessage, closeModal, active }) => {
  const { user, setIsLinked } = useAuth();
  const [password, setPassword] = useState(null);
  const [confirmedPassword, setConfirmedPassword] = useState(null);
  const [linking, setLinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    color: "red",
    text: "Very weak",
  });

  const setToast = setToastMessage;
  const closeAddDeviceModal = () => {
    closeModal();
    setToast("Account linking will pop out again after few hours.");
  };
  useEffect(() => {
    setToast(errorMessage);
  }, [errorMessage, setToast]);

  useEffect(() => {
    password && setPasswordStrength(evaluatePasswordStrength(password));
  }, [password]);

  const link = async () => {
    if (!password || !confirmedPassword) {
      setLinking(false);
      setErrorMessage("There's an empty field.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return;
    }
    if (confirmedPassword !== password) {
      setLinking(false);
      setErrorMessage("Password does not match.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return;
    }
    if (password.length < 6) {
      setLinking(false);
      setErrorMessage("Password must be greater than 6 characters.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return;
    }
    if (!linking) {
      setLinking(true);
      setToast("Linking your account...");
      await linkAccount(user, user.email, password)
        .catch(() => {
          setErrorMessage("Failed linking. Try again.");
        })
        .finally(() => {
          setLinking(false);
          setIsLinked(true);
          setToast("Account linked!");
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    }
  };
  return (
    <GenericModal
      width="364px"
      headerTitle="Account link"
      active={active}
      closeModal={closeAddDeviceModal}
      content={
        <div className="modal-content-container">
          <h3>Link your account with a password</h3>
          <p>
            We require to link your Google account with a password to make your
            integration with a microcontroller easier.{" "}
          </p>
          <p>
            Your Google account will remain secure, it will only be linked to an
            account within this app's authentication system.
          </p>
          <p>
            This way, you can sign in both with email (the same email as your
            google account) and password, and Google.
          </p>
          <h3>Set up your password</h3>
          <input
            placeholder="Password"
            type="password"
            enterKeyHint="Enter"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onKeyUp={(e) => e.key === "Enter" && link()}
          ></input>
          {password && (
            <div className="password-strength-container">
              <progress
                className={`${"password-strength " + passwordStrength.color}`}
                value={passwordStrength.strength}
                max="100"
              ></progress>
              <h6 className="right">{passwordStrength.text}</h6>
            </div>
          )}
          <input
            placeholder="Confirm password"
            type="password"
            enterKeyHint="Enter"
            required
            onChange={(e) => {
              setConfirmedPassword(e.target.value);
            }}
            onKeyUp={(e) => e.key === "Enter" && link()}
          ></input>
          <Button
            className="nav-button center"
            text="Remind me later."
            onclick={closeModal}
          ></Button>
        </div>
      }
    />
  );
};
