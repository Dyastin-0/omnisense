import { GenericModal } from "../modal";

export const InfoModal = ({ active, closeModal }) => {
  return (
    <GenericModal
      width="400px"
      headerTitle="Info"
      active={active}
      closeModal={closeModal}
      content={
        <div className="modal-content-container">
          <h5>What is Omnisense?</h5>
          <p>
            It is an automation tool that you can use on your personal projects;
            all you need is a microcontroller that supports Wi-Fi to start, you
            can check the sample Arduino code in the Help (?) modal.
          </p>
          <p>
            Omnisense is open-source, you can clone the project on my Github,
            simply change the Firebase config with your own for further
            customization.
          </p>
          <h5>Project Stack</h5>
          <p>ReactJS, Firebase Authentication & Real-time Database</p>
          <h5>Developed by</h5>
          <p>Justine Paralejas</p>
          <h5>Socials</h5>
          <div className="row left">
            <a
              href="https://github.com/Dyastin-0"
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa-brands fa-github fa-lg"></i>
            </a>
            <a
              href="https://www.facebook.com/dyastinparalejas"
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa-brands fa-facebook fa-lg"></i>
            </a>
          </div>
        </div>
      }
    />
  );
};
