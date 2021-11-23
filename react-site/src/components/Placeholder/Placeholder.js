import React from 'react';

import './Placeholder.css'

export const Placeholder = ({
  style
}) => {
  return (
    <div 
      className='placeholder'
      style={style}
    >
      <div className='placeholder-panel placeholder-panel--thick'></div>
      <div className='placeholder-panel placeholder-panel--thin'></div>
    </div>
  )
}