import React from "react";

import "./TextLink.css";

export const TextLink = ({ href, children }) => {
  return (
    <a href={href} className="textlink">
      <span className="textlink-label">{children}</span>
    </a>
  );
};
