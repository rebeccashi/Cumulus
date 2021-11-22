import React from "react";

import './Text.css'

export const Text = ({
    color='purple',
    children
  }) => {
    const colorClass = `color--${color}`;
    
    return (<p> className={colorClass}{children} </p>);
  }