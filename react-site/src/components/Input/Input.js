import React from "react";

import "./Input.css";
import Icon from "../Icon";

export const Input = ({
  color = "blue",
  placeholder,
  label,
  type = "text",
  autofocus = false,
  withIcon,
  iconVariant,
  value,
  autocomplete = "",
  setValue,
  onSubmit = null,
  style,
}) => {
  const colorClass = `input-color--${color}`;

  const [isActive, setIsActive] = React.useState(false);

  return (
    <div
      className={`input ${isActive ? "active" : ""} ${
        label?.length > 0 ? "with-label" : ""
      }`}
      style={style}
    >
      <span className="input-placeholder">
        {isActive ? label : placeholder}
      </span>
      <span className="input-autocomplete">
        <span className="input-autocomplete--value">{value}</span>
        <span className="input-autocomplete--autocomplete">{autocomplete}</span>
      </span>
      <input
        autoFocus={autofocus}
        type={type}
        className={`input-input ${colorClass} ${withIcon ? "with-icon" : ""}`}
        onFocus={() => setIsActive(true)}
        onBlur={(e) => {
          if (e.target.value.length === 0) setIsActive(false);
        }}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value.length === 0) setIsActive(false);
          else setIsActive(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Tab" && autocomplete !== "") {
            e.preventDefault();
            setValue(`${value}${autocomplete}`);
          }
          if (e.key === "Enter" && onSubmit != null) {
            e.preventDefault();
            onSubmit(e.target.value);
          }
        }}
        value={value}
      />
      {withIcon ? (
        <div className="input-icon">
          <Icon variant={iconVariant} color="purple" size="xs" />
        </div>
      ) : null}
    </div>
  );
};
