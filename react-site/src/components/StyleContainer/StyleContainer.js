import "./StyleContainer.css";

export const StyleContainer = ({ theme = "default", children }) => {
  const themeClass = `theme--${theme}`;

  return <div className={themeClass}>{children}</div>;
};
