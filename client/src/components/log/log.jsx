export const Log = ({ isMessageOwner, sentBy, timeSent, message }) => {
  return (
    <div className="message-container">
      <p
        className={`small description ${isMessageOwner ? "right" : undefined}`}
      >
        {isMessageOwner ? `On ${timeSent} you` : `${sentBy} on ${timeSent}`}
      </p>
      <p className={`message ${isMessageOwner ? "right" : undefined}`}>
        {" "}
        {message}{" "}
      </p>
    </div>
  );
};
