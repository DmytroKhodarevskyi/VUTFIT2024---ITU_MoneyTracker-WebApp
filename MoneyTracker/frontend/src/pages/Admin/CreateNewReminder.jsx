import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const CreateReminderAdmin = () => {
  const { pk } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    amount: "",
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { title, deadline, amount } = formData;

    if (!title || !deadline || !amount) {
      alert("All fields are required.");
      setLoading(false);
      return;
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate) || deadlineDate <= new Date()) {
      alert("Deadline must be a valid date in the future.");
      setLoading(false);
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Amount must be a valid number greater than 0.");
      setLoading(false);
      return;
    }

    

    try {
        const payload = {
          title: title.trim(),
          deadline: deadline.trim(),
          amount: parsedAmount,
        };
        console.log("Payload:", payload);
        const response = await api.post(`/api/custom_admin/user/${pk}/reminders/`, payload);
        alert("Reminder created successfully!");
        setError(null);
        navigate(`/custom-admin/users/${pk}/reminders`); 
      } catch (error) {
        console.error("Error creating reminder:", error.response?.data || error.message);
        console.error("Error response:", error.response?.data);
        alert(
          `Error: ${
            error.response?.data?.detail || "An error occurred while creating the reminder."
          }`
        );
      } finally {
        setLoading(false);
      }
      
  };

  return (
    <form onSubmit={handleSubmit} className="admin-main">
      <h1 className="admin-header">Create Reminder for User</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="admin-input-container">
        <input
          type="text"
          name="title"
          placeholder="Reminder Title*"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="input-field"
        />
        <input
          type="datetime-local"
          name="deadline"
          placeholder="Deadline*"
          value={formData.deadline}
          onChange={handleInputChange}
          required
          className="input-field"
        />
        <input
          type="number"
          step="0.01"
          name="amount"
          placeholder="Amount*"
          value={formData.amount}
          onChange={handleInputChange}
          required
          className="input-field"
        />
      </div>

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Creating..." : "Create Reminder"}
      </button>
    </form>
  );
};

export default CreateReminderAdmin;
