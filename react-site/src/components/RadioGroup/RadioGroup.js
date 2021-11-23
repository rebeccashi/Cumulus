import React from "react";

import './RadioGroup.css';

export const RadioGroup = ({
  color='blue',
  options,
  value,
  setValue
}) => {
  const colorClass = `radiogroup-color--${color}`;
  
  return (
    <div className='radiogroup'>
      {
        options.map(opt => {
          return (
            <>
              <div className={`radiogroup-button ${value === opt.value ? 'active' : ''} ${colorClass}`} onClick={() => {
                setValue(opt.value);
              }}>
                <span className='radiogroup-button--text'>{opt.label}</span>
              </div>
            </>
          )
        })
      }
    </div>
  );
}