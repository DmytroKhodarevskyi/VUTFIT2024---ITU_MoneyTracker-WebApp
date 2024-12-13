/**
 * File: CreateReminderPopUp.jsx
 * Description: Popup for creating a new reminder.
 * Author: Dmytro Khodarevskyi, Denys Chernenko
 * 
 * Notes:
 * - _
 */


import React, { useState } from "react";
import api from "../../api"; 
import { useEffect } from "react";
import "./CreateReminderPopUp.css";
import Notification from "../../components/Notifications/Notifications";

function CreateReminderPopup({ showPopup, setShowPopup, setRemindersList }) {
  const [title, setTitle] = useState("");
 
  const [amount, setAmount] = useState("");


  const [deadline, setDeadline] = useState("");
  const [notification, setNotification] = useState(null);
  const getNextValidDeadline = () => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 24);
    currentDate.setMilliseconds(0);  
    return currentDate.toISOString().slice(0, 16);
  };

  const getDeadlineWithExtraHour = () => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 26);
    currentDate.setMilliseconds(0);  
    return currentDate.toISOString().slice(0, 16);
  };
  const closeNotification = () => {
    setNotification(null); 
  };
  useEffect(() => {
    if (showPopup) {
      setDeadline(getDeadlineWithExtraHour());
    }
  }, [showPopup]); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    

    
    if (title === "") {
      
      setNotification({
        message: "Title cant be empty.",
        type: "error",
      });
      return;
    }
    const today = new Date();
    const minimumDeadline = new Date(today);
    minimumDeadline.setHours(today.getHours() + 24); 

    
    if (new Date(deadline) < minimumDeadline) {
      
      setNotification({
        message: "Deadline must be at least 24 hours from the current time.",
        type: "error",
      });
      return;
    }
    if (amount <= 0) {
      
      setNotification({
        message: "Amount must be greater than 0.",
        type: "error",
      });
      return;
    }
    try {
      
      const response = await api.post("/api/reminders/reminders/create/", {
        title,
        deadline,
        amount,
      });
     
      setRemindersList((prevReminders) => [...prevReminders, response.data]);
      setShowPopup(false);
    } catch (error) {
      console.error("Error creating reminder:", error);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="create-reminder-popup">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <div className="popup-content">
        <h2>Create Reminder</h2>
        <form onSubmit={handleSubmit}>
        
          <label>
            Title:
          </label>
            <input
              type="text"
              className="reminder-textinput-title"
              value={title}
              maxLength="127"
              onChange={(e) => setTitle(e.target.value)}
              
            />
          <label>
            Deadline:
          </label>

            <input
              type="datetime-local"
              className="reminder-textinput-deadline"
              value={deadline}
              min={getNextValidDeadline()}
              onChange={(e) => setDeadline(e.target.value)}
              
            />
          <label>
            Amount:
          </label>

            <input
              type="number"
              step="0.01"
              className="reminder-textinput-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              
            />
          <div className="popup-buttons">
            <button
              onClick={handleSubmit}
              type="submit"
              className="reminder-button-create"
            >
              Create
            </button>
            <button
              type="button"
              className="reminder-button-cancel"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  }
  
  export default CreateReminderPopup;
  