import React from "react";

import './Input.css';
import Icon from '../Icon';

export const Input = ({
  color='blue',
  placeholder,
  label,
  withIcon,
  iconVariant,
  value,
  autocomplete='',
  setValue
}) => {
  const colorClass = `input-color--${color}`;

  const [isActive, setIsActive] = React.useState(false);
  
  return (
    <div class={`input ${isActive ? 'active' : ''} ${label?.length > 0 ? 'with-label' : ''}`}>
      <span className='input-placeholder'>{
        isActive ?
        label :
        placeholder
      }</span>
      <span className='input-autocomplete'>
        <span className='input-autocomplete--value'>{value}</span>
        <span className='input-autocomplete--autocomplete'>{autocomplete}</span>
      </span>
      <input 
        type='text' 
        className={`input-input ${colorClass} ${withIcon ? 'with-icon' : ''}`} 
        onFocus={() => setIsActive(true)}
        onBlur={(e) => {
          if (e.target.value.length == 0) setIsActive(false)
        }}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value.length == 0) setIsActive(false)
          else setIsActive(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            setValue(`${value}${autocomplete}`);
          }
        }}
        value={value}
      />
      {
        withIcon ?
        (
          <div  className='input-icon'>
            <Icon variant={iconVariant} color='purple' size='xs' />
          </div> 
        ) : 
        null
      }
    </div>
  );
}