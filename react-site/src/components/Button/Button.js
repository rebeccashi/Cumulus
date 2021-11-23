import React from "react";

import './Button.css';
import Icon from '../Icon';

export const Button = ({
  color='blue',
  withIcon,
  iconVariant,
  label
}) => {
  const colorClass = `button-color--${color}`;
  
  return (
    <div className={`button ${colorClass} ${withIcon ? 'with-icon' : ''}`}>
      <span className='button-label'>
        {label}
      </span>
      {
        withIcon ?
        (
          <div className='button-icon'>
            <Icon variant={iconVariant} size='xs' />
          </div>
        ) : null
      }
    </div>
  );
}