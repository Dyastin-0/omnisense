import "./modal.css";

import { Button } from "../button/button";
import { useEffect, useState } from "react";

export const GenericModal = ({
  active,
  className,
  closeModal,
  width,
  headerTitle,
  content,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(active);
  }, [active]);

  return (
    <>
      <div
        className={`modal-overlay ${isOpen ? "open" : undefined} ${className}`}
        onClick={closeModal}
      ></div>
      <div
        className={`modal ${isOpen ? "open" : undefined} ${className}`}
        style={{ width: width }}
      >
        <div className="modal-header">
          <h5> {headerTitle} </h5>
          <Button
            className="nav-button"
            onclick={closeModal}
            icon={<i className="fa-solid fa-xmark"></i>}
          />
        </div>
        <div className="modal-content">{content}</div>
      </div>
    </>
  );
};
