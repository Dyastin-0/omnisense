import "./custom-tooltip.css";

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <h5>{label}</h5>
        {payload.map((load, key) => {
          const wholeHours = Math.floor(load.value);
          const remainingMinutes = Math.floor((load.value - wholeHours) * 60);
          const remainingSeconds = Math.floor(
            ((load.value - wholeHours) * 60 - remainingMinutes) * 60
          );
          return (
            <div className="row left" key={key}>
              <p>{load.name}</p>
              <h6>{`${wholeHours} h ${remainingMinutes} m ${remainingSeconds} s`}</h6>
            </div>
          );
        })}
      </div>
    );
  }
};
