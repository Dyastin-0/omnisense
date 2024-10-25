import "./custom-tooltip.css";

export const ConsumptionTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <h5>{label}</h5>
        {payload.map((load, key) => {
          return (
            <div className="row left" key={key}>
              <p>{load.name}</p>
              <h6>{`${load.value.toFixed(2)} W`}</h6>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
