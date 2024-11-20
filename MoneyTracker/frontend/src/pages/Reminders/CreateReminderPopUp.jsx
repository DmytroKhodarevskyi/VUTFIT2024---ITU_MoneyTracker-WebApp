import React, { useState } from "react";
import api from "../../api"; 
import "./CreateReminderPopup.css";

function CreateReminderPopup({ showPopup, setShowPopup, setRemindersList }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Deadline:
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </label>
          <label>
            Amount:
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <div className="popup-buttons">
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateReminderPopup;
