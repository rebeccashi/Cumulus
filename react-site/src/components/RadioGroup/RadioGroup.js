import React from "react";

import "./RadioGroup.css";

import Button from "../Button";

export const RadioGroup = ({ color = "blue", options, value, setValue }) => {
  return (
    <div className="radiogroup">
      {options.map((opt, i) => {
        return (
          <div key={i} className="radiogroup-button">
            <Button
              color={color}
              withIcon={typeof opt.icon !== "undefined"}
              iconVariant={opt.icon}
              forceActive={opt.value === value}
              label={opt.label}
              onClick={() => {
                setValue(opt.value);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
