import * as React from "react";

export const NavigationButton = ({
  label,
  onClick,
  className
}) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

