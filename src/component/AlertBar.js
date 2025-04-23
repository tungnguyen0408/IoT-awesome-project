import React from "react";

const AlertBar = ({ isWindAlert }) => {
  if (!isWindAlert) return null;

  return (
    <div className="wind-alert">⚠️ Cảnh báo: Gió lớn vượt ngưỡng an toàn!</div>
  );
};

export default AlertBar;
