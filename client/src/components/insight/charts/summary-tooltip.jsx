import "./custom-tooltip.css";

export const SummaryTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <h5>{label}</h5>
        {payload.map((load, key) => {
          return (
            <div className="row left" key={key}>
              {load.name === "Consumption" ? (
                <>
                  <p>{load.name}</p>
                  <h6>{`${load.value.toFixed(2)} kWh`}</h6>
                </>
              ) : (
                <>
                  <p>{load.name}</p>
                  <h6>{`\u20B1${load.value.toFixed(2)}`}</h6>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
