/**
 * File: Notifications.jsx
 * Description: Component for notifiers.
 * Author: Rostyslav Kachan
 * 
 * Notes:
 * - _
 */


import React, { useEffect } from "react";
import "./Notifications.css";
import closeIcon from "./close.png"

function Notification({ message, type = "error", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      <img 
        
        src={closeIcon} 
        alt="Close" 
        className="notification-close" 
        onClick={onClose} 
      />
    </div>
  );
}

export default Notification;
