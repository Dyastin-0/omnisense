import React from "react";
import { motion } from "framer-motion";
import "./toggle.css";

const spring = {
  type: "spring",
  stiffness: 500,
  damping: 100,
};

export default function Toggle({ size, checked, onChange }) {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div
      className={`toggle ${size}`}
      data-is-on={checked}
      onClick={handleClick}
    >
      <motion.div className="handle" layout transition={spring} />
    </div>
  );
}
