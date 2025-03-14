import "./loading.css";

export const Loading = ({ text }) => {
  return (
    <div className="loading">
      <h4>{text}</h4>
      <i className="fa-solid fa-slash fa-spin"></i>
    </div>
  );
};
