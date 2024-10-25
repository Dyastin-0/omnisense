import "./dropdown.css";
import { useState } from "react";

import { Button } from "../button/button";

export const Dropdown = ({ buttonSize, name, content, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="dropdown">
      {
        <Button
          className={`nav-button ${buttonSize}`}
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
      >
        {content}
      </div>
    </div>
  );
};
