import "./custom-tooltip.css";

export const ConsumptionTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <h5>{label}</h5>
        {payload.map((load, key) => {
          const value = load.value.consumption || load.value;
          return (
            <div className="row left" key={key}>
              <p>{load.name.split(".")[0]}</p>
              <h6>{`${value.toFixed(2)} kWh`}</h6>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
