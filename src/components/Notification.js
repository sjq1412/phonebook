import React from "react";

const Notification = ({ message, variant }) => {
  if (!message) {
    return null;
  }

  return <div className={`notification ${variant}`}>{message}</div>;
};

export default Notification;
