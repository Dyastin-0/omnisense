export const Pad = ({ options, content }) => {
  return (
    <div
      className={`content-panel flex-max ${options ? `${options.panel}` : ""}`}
    >
      <div className={`container ${options ? `${options.container}` : ""}`}>
        {content}
      </div>
    </div>
  );
};
