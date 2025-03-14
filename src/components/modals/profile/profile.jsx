import { useAuth } from "../../../contexts/auth/auth";

import { GenericModal } from "../modal";

export const UserProfile = ({ closeModal, active }) => {
  const { user } = useAuth();

  return (
    <GenericModal
      headerTitle="Profile"
      closeModal={closeModal}
      active={active}
      content={
        <div className="modal-content-container">
          <div className="column">
            <p className="description">Display name</p>
            <p>{user?.displayName}</p>
          </div>
          <div className="column">
            <p className="description">Email</p>
            <p>{user.email}</p>
          </div>
          <div className="column">
            <p className="description">Unique ID</p>
            <p>{user.uid}</p>
          </div>
        </div>
      }
    />
  );
};
