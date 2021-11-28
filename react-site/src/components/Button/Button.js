import React from "react";

import './Button.css';
import Icon from '../Icon';

export const Button = ({
  color='blue',
  withIcon,
  iconVariant,
  forceActive,
  label,
  onClick
}) => {
  const colorClass = `button-color--${color}`;
  const [iconColor, setIconColor] = React.useState(undefined);
  
  return (
    <div 
      className={`button ${forceActive ? 'active' : ''} ${colorClass} ${withIcon ? 'with-icon' : ''}`} 
      onClick={onClick}
      onMouseDown={() => setIconColor('white')}
      onMouseUp={() => setIconColor(undefined)}
    >
      <span className='button-label'>
        {label}
      </span>
      {
        withIcon ?
        (
          <div className='button-icon'>
            <Icon color={forceActive ? 'white' : iconColor} variant={iconVariant} size='xs' />
          </div>
        ) : null
      }
    </div>
  );
}