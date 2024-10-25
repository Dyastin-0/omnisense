import React from "react";

import "./button.css";

export const Button = React.forwardRef(
  ({ onclick, id, className, text, icon }, ref) => {
    return (
      <button onClick={onclick} ref={ref} id={id} className={className}>
        {text} {icon}
      </button>
    );
  }
);
