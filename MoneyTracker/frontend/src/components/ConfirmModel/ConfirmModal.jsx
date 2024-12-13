/**
 * File: ConfirmModal.jsx
 * Description: Confirmation Popup.
 * Author: Denys Chernenko
 * 
 * Notes:
 * - _
 */


import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
