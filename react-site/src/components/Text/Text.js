import React from "react";

import './Text.css';

export const Text = ({
  variant='default',
  color='purple',
  children
}) => {
  const colorClass = `color--${color}`;
  
  return (
    <p className={`${colorClass} ${variant}`}>{children}</p>
  );
}