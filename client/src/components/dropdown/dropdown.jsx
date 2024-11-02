import "./dropdown.css";
import { useState } from "react";

import { Button } from "../button/button";

export const Dropdown = ({ buttonSize, name, children, className, width }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  return (
    <div className="dropdown" style={{ width: width }}>
      {
        <Button
          className={`nav-button ${buttonSize} full`}
          onclick={toggle}
          text={name}
          icon={
            <i
              className={`fa fa-chevron-down chevron ${
                isOpen ? "open" : undefined
              }`}
            />
          }
        />
      }
      <div
        className={`dropdown-menu ${className} ${isOpen ? "open" : undefined}`}
        onClick={toggle}
      >
        {children}
      </div>
    </div>
  );
};
