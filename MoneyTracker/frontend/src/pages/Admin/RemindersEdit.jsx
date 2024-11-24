import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { Link } from "react-router-dom";
import "./Admin.css";

const RemindersEdit = () => {
  const { pk } = useParams();
  const [reminders, setReminders] = useState([]);
  const [selectedReminders, setSelectedReminders] = useState([]);
  const [editingReminder, setEditingReminder] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [fieldBeingEdited, setFieldBeingEdited] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const fetchReminders = async () => {
    try {
      const remindersResponse = await api.get(
        `/api/custom_admin/users/${pk}/reminders/`
      );
      const usernameResponse = await api.get(
        `/api/custom_admin/users/${pk}/username/`
      );
      setReminders(remindersResponse.data);
      setUsername(usernameResponse.data.username);
    } catch (err) {
      console.error("Failed to load reminders:", err);
      setError("Failed to load reminders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [pk]);

  const toggleReminderSelection = (id) => {
    setSelectedReminders((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((reminderId) => reminderId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDoubleClick = (reminderId, currentValue, field) => {
    setEditingReminder(reminderId);
    setTempValue(currentValue);
    setFieldBeingEdited(field);
  };

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleSaveEdit = async (reminderId) => {
    try {
      let updatedValue = tempValue.trim();

      if (fieldBeingEdited === "amount") {
        const parsedAmount = parseFloat(updatedValue);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          alert("Amount must be a positive number.");
          return;
        }
        updatedValue = parsedAmount.toFixed(2);
      }

      if (fieldBeingEdited === "deadline") {
        const deadlineDate = new Date(updatedValue);
        if (isNaN(deadlineDate) || deadlineDate <= new Date()) {
          alert("Deadline must be a valid date in the future.");
          return;
        }
      }

      const payload = { [fieldBeingEdited]: updatedValue };

      await api.put(`/api/custom_admin/reminders/${reminderId}/update/`, payload);

      setReminders((prevReminders) =>
        prevReminders.map((reminder) =>
          reminder.id === reminderId
            ? { ...reminder, [fieldBeingEdited]: updatedValue }
            : reminder
        )
      );

      setEditingReminder(null);
      setFieldBeingEdited("");
    } catch (err) {
      console.error("Failed to update reminder:", err.response?.data || err);
      setError("Failed to update reminder");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedReminders.length === 0) {
      alert("Please select reminders to delete.");
      return;
    }

    try {
      await api.delete(`/api/custom_admin/reminders/batch-delete/`, {
        data: { reminder_ids: selectedReminders },
      });

      setReminders(
        reminders.filter(
          (reminder) => !selectedReminders.includes(reminder.id)
        )
      );
      setSelectedReminders([]);
    } catch (err) {
      console.error("Failed to delete reminders:", err.response?.data || err);
      setError("Failed to delete reminders");
    }
  };

  if (loading) return <p>Loading reminders...</p>;
  if (error) return <p>{error}</p>;

  if (reminders.length === 0) {
    return (
      <div className="admin-main-buttons">
        <h1 className="admin-header">{username}'s Reminders</h1>
        <h1 className="admin-header">No reminders were found</h1>
        <Link to={`/custom-admin/user/${pk}/create-reminder/`}>
          <button>Create Reminder</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-main-buttons">
      <h1 className="admin-header">{username}'s Reminders</h1>
      <Link to={`/custom-admin/user/${pk}/create-reminder/`}>
        <button>Create Reminder</button>
      </Link>
      <button
        onClick={handleDeleteSelected}
        disabled={selectedReminders.length === 0}
      >
        Delete Selected
      </button>
      <ul className="admin-userlist">
        {reminders.map((reminder) => (
          <li key={reminder.id} className="admin-useritem">
            <input
              type="checkbox"
              checked={selectedReminders.includes(reminder.id)}
              onChange={() => toggleReminderSelection(reminder.id)}
            />
            <h1 className="admin-user-label">Title:</h1>
            {editingReminder === reminder.id && fieldBeingEdited === "title" ? (
              <input
                type="text"
                value={tempValue}
                onChange={handleInputChange}
                onBlur={() => handleSaveEdit(reminder.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(reminder.id);
                }}
                autoFocus
              />
            ) : (
              <h2
                className="admin-user-value"
                onDoubleClick={() =>
                  handleDoubleClick(reminder.id, reminder.title, "title")
                }
              >
                {reminder.title || "No title"}
              </h2>
            )}
            <h1 className="admin-user-label">Deadline:</h1>
            {editingReminder === reminder.id &&
            fieldBeingEdited === "deadline" ? (
              <input
                type="datetime-local"
                value={tempValue}
                onChange={handleInputChange}
                onBlur={() => handleSaveEdit(reminder.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(reminder.id);
                }}
                autoFocus
              />
            ) : (
              <h2
                className="admin-user-value"
                onDoubleClick={() =>
                  handleDoubleClick(reminder.id, reminder.deadline, "deadline")
                }
              >
                {new Date(reminder.deadline).toLocaleString()}
              </h2>
            )}
            <h1 className="admin-user-label">Amount:</h1>
            {editingReminder === reminder.id && fieldBeingEdited === "amount" ? (
              <input
                type="number"
                step="0.01"
                value={tempValue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
                    setTempValue(value);
                  }
                }}
                onBlur={() => handleSaveEdit(reminder.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(reminder.id);
                }}
                autoFocus
              />
            ) : (
              <h2
                className="admin-user-value"
                onDoubleClick={() =>
                  handleDoubleClick(reminder.id, reminder.amount, "amount")
                }
              >
                {reminder.amount}
              </h2>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemindersEdit;
