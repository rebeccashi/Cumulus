import React from 'react';

import './Placeholder.css'

export const Placeholder = ({
  height=null,
  width=null,
  borderRadius=null,
}) => {
  const style = {};

  if (height != null) style.height = height;
  if (width != null) style.width = width;
  if (borderRadius != null) style.borderRadius = borderRadius;

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