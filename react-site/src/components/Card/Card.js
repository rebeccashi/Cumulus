import React from "react";

import './Card.css';

export const Card = ({
  variant='default',
  color='blue',
  onClick,
  style,
  children
}) => {
  const colorClass = `card-color--${color}`;
  
  return (
    <div 
      className={`card ${colorClass} ${variant === 'interactive' ? 'interactive' : ''}`}
      onClick={
        (e) => {
          if (variant === 'interactive') {
            onClick(e)
          }
        }
      }
      style={style}
    >
      {children}
    </div>
  );
}