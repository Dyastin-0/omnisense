import "./confirm-dialog.css";

import { useEffect, useState } from "react";
import { Button } from "../../button/button";
import { GenericModal } from "../../modals/modal";

export const ConfirmDialogModal = ({ event, message }) => {
  const [open, setOpen] = useState(false);
  const [confirmEvent, setConfirmEvent] = useState(null);

  useEffect(() => {
    if (event) {
      setConfirmEvent(() => event);
      setOpen(true);
    }
  }, [event]);

  const handleOkay = () => {
    confirmEvent && confirmEvent();
    setConfirmEvent(null);
    setOpen(false);
  };

  const handleCancel = () => {
    setConfirmEvent(null);
    setOpen(false);
  };

  return (
    <GenericModal
      width="250px"
      className=" above"
      active={open}
      headerTitle="Confirm"
      closeModal={handleCancel}
      content={
        <div className="confirm-container">
          <p className="p"> {message} </p>
          <div className="wrapper">
            <Button className="nav-button" onclick={handleOkay} text="Yes" />
            <Button className="nav-button" onclick={handleCancel} text="No" />
          </div>
        </div>
      }
    />
  );
};
