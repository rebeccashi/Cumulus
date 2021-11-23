import React from "react";

import './RadioGroup.css';

export const RadioGroup = ({
  color='blue',
  options,
  setValue
}) => {
  const colorClass = `radiogroup-color--${color}`;

  const [active, setActive] = React.useState(null);
  
  return (
    <div className='radiogroup'>
      {
        options.map(opt => {
          return (
            <>
              <div className={`radiogroup-button ${active === opt.value ? 'active' : ''} ${colorClass}`} onClick={() => {
                setActive(opt.value);
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