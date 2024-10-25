import { GenericModal } from "../modal";

export const HelpModal = ({ closeModal, active }) => {
  return (
    <GenericModal
      width={"364px"}
      headerTitle={"Help"}
      closeModal={closeModal}
      active={active}
      content={
        <div className="modal-content-container">
          <h5>API key</h5>
          <p>AIzaSyDI30Fd3AtxjZfCPC0QnaaQ68lUWe1_eK0</p>
          <h5>Database URL</h5>
          <p>
            https://omnisense-17447-default-rtdb.asia-southeast1.firebasedatabase.app
          </p>
          <h5>How to use</h5>
          <p>
            You'll need a microcontroller that supports Wi-Fi such as ESP32 &
            ESP8266.
          </p>
          <p>
            Connect your McU by using stable Firebase library such as
            FirebaseClient by Mobizt.
          </p>
          <h5>Check out the sample Arduino code at</h5>
          <a
            href="https://github.com/Dyastin-0/home-aut/blob/master/public/sample/sample.ino"
            rel="noreferrer"
            target="_blank"
          >
            ESP32 Firebase Client
          </a>
        </div>
      }
    />
  );
};
