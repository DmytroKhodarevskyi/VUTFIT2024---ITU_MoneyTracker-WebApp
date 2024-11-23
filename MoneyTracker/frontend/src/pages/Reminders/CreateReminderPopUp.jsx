import React, { useState } from "react";
import api from "../../api"; 
import { useEffect } from "react";
import "./CreateReminderPopUp.css";

function CreateReminderPopup({ showPopup, setShowPopup, setRemindersList }) {
  const [title, setTitle] = useState("");
 
  const [amount, setAmount] = useState("");


  const [deadline, setDeadline] = useState("");

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

  useEffect(() => {
    if (showPopup) {
      setDeadline(getDeadlineWithExtraHour());
    }
  }, [showPopup]); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount <= 0) {
      window.alert("Amount must be greater than 0.");
      return;
    }

    if (!title || !deadline || !amount) {
      alert("All fields are required.");
      return;
    }

    const today = new Date();
    const minimumDeadline = new Date(today);
    minimumDeadline.setHours(today.getHours() + 24); 

    if (new Date(deadline) < minimumDeadline) {
      alert("Deadline must be at least 24 hours from the current time.");
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
      <div className="popup-content">
        <h2>Create Reminder</h2>
        <form onSubmit={handleSubmit}>
        {/* <form> */}
          <label>
            Title:
          </label>
            <input
              type="text"
              className="reminder-textinput-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
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
              required
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
              required
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
  