import React from "react";

import "./button.css";

export const Button = React.forwardRef(
  ({ onclick, id, className, text, icon, type }, ref) => {
    return (
      <button
        onClick={onclick}
        ref={ref}
        id={id}
        className={className}
        type={type}
      >
        {text} {icon}
      </button>
    );
  }
);
