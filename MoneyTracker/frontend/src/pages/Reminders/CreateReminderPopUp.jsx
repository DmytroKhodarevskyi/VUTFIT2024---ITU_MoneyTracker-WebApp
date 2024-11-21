import React, { useState } from "react";
import api from "../../api"; 
import "./CreateReminderPopup.css";

function CreateReminderPopup({ showPopup, setShowPopup, setRemindersList }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    console.log("SUBMITTTTTTTTTTTTTTTTTTT");
    e.preventDefault();

    if (!title || !deadline || !amount) {
      alert("All fields are required.");
      return;
    }

    const today = new Date();
    const oneDayLater = new Date(today);
    oneDayLater.setDate(today.getDate() + 1);

    console.log(new Date(deadline) + "DEADLINE");
    console.log(oneDayLater + "ONE DAY LATER");
    if (new Date(deadline) < oneDayLater) {
      alert("Deadline must be at least one day later than today.");
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
        {/* <form onSubmit={handleSubmit}> */}
        <form>
          <label>
            Title:
          </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          <label>
            Deadline:
          </label>

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          <label>
            Amount:
          </label>

            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          <div className="popup-buttons">
            {/* <button className="create-reminder" type="submit">Create</button> */}
            <button className="create-reminder" onClick={handleSubmit}>Create</button>
            <button className="create-reminder" type="button" onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateReminderPopup;
