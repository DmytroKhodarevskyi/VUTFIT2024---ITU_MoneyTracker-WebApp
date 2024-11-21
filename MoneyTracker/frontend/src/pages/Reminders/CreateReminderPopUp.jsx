import React, { useState } from "react";
import api from "../../api"; 
import "./CreateReminderPopup.css";

function CreateReminderPopup({ showPopup, setShowPopup, setRemindersList }) {
  const [title, setTitle] = useState("");
 
  const [amount, setAmount] = useState("");


  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); 
    return tomorrow.toISOString().slice(0, 16); 
  };

  const [deadline, setDeadline] = useState(getTomorrowDate);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === "") {
        window.alert("Title cannot be empty.");
        return;
      }
    if (amount <= 0) {
        window.alert("Amount must be greater than 0.");
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
          <label>
            Title:
            <input
              type="text"
              className="reminder-textinput-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Deadline:
            <input
              type="datetime-local"
              className="reminder-textinput-deadline"
              value={deadline}
              min={getTomorrowDate()}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </label>
          <label>
            Amount:
            <input
              type="number"
              step="0.01"
              className="reminder-textinput-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <div className="popup-buttons">
            <button
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
  