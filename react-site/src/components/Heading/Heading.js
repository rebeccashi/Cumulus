import React from 'react';

import './Heading.css'

export const Heading = ({
  variant='h1',
  color='purple',
  children
}) => {
  const colorClass = `heading-color--${color}`;

  switch (variant) {
    case 'h1': return (
      <h1 className={colorClass}>{children}</h1>
    );
    case 'h2': return (
      <h2 className={colorClass}>{children}</h2>
    );
    case 'h3': return (
      <h3 className={colorClass}>{children}</h3>
    );
    case 'h4': return (
      <h4 className={colorClass}>{children}</h4>
    );
    case 'h5': return (
      <h5 className={colorClass}>{children}</h5>
    );
    case 'h6': return (
      <h6 className={colorClass}>{children}</h6>
    );
    default: return (
      <h1 className={colorClass}>{children}</h1>
    );
  }
}