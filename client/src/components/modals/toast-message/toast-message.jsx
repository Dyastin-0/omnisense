import { useEffect, useState } from "react";
import "./toast-message.css";
import { Button } from "../../button/button";

export const ToastMessage = ({ setToastMessage, message }) => {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [xPosition, setXPosition] = useState("50%");

  const handleClose = () => {
    setOpen(false);
    setIsDragging(false);
    setXPosition("50%");
    setToastMessage(null);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (isDragging) {
      const clientX =
        e.type === "mousemove" ? `${e.clientX}px` : `${e.touches[0].clientX}px`;
      setXPosition(clientX);
    }
  };

  useEffect(() => {
    const addListeners = () => {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleClose);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("touchend", handleClose);
    };

    const removeListeners = () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleClose);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleClose);
    };

    if (isDragging) {
      addListeners();
    } else {
      removeListeners();
    }

    return () => removeListeners();
  }, [isDragging]);

  useEffect(() => {
    if (message !== null) {
      setOpen(true);
      const timer = setTimeout(() => {
        setOpen(false);
        setToastMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, setToastMessage]);

  return (
    <div
      style={{ left: xPosition }}
      className={`toast-message ${open ? "open" : ""}`}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <h5 className="message-t">{open ? message : ""}</h5>
      <Button
        className="nav-button"
        icon={<i className="fa-solid fa-xmark"></i>}
        onClick={handleClose}
      />
    </div>
  );
};
