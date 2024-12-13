/**
 * File: DiscardForm.jsx
 * Description: Component for confirming changes discard.
 * Author: Denys Chernenko
 * 
 * Notes:
 * - _
 */


import React from 'react';
import './DiscardForm.css'; 

const DiscardForm = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>Are you sure you want to discard your changes?</p>
                <div className="modal-buttons">
                    <button className="button-confirm" onClick={onConfirm}>Yes, Discard</button>
                    <button className="button-cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DiscardForm;
