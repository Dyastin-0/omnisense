import "./custom-tooltip.css";

export const CostTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <h5>{label}</h5>
        {payload.map((load, key) => {
          const value = load.value.cost || load.value;
          return (
            <div className="row left" key={key}>
              <p>{load.name}</p>
              <h6>{`\u20B1${value.toFixed(2)}`}</h6>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
