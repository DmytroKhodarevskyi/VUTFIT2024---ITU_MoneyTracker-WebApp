import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const CreateThreadAdmin = () => {
  const { pk } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    text_content: "",
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!formData.title.trim()) {
      alert("Thread title is required.");
      setLoading(false);
      return;
    }
  
    if (!formData.text_content.trim()) {
      alert("Thread content is required.");
      setLoading(false);
      return;
    }
  
    const payload = {
      title: formData.title.trim(),
      text_content: formData.text_content.trim(),
      group: pk,
    };
  
    console.log("Payload:", payload);
  
    try {
      await api.post(`/api/custom_admin/groups/${pk}/threads/create/`, payload);
      alert("Thread created successfully!");
      navigate(`/custom-admin/groups/${pk}/threads`);
    } catch (error) {
      console.error("Error creating thread:", error.response || error.message);
      alert(
        `Error: ${
          error.response?.data?.detail || "An error occurred while creating the thread."
        }`
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="admin-main">
      <h1 className="admin-header">Create New Thread</h1>

      <div className="admin-input-container">
        
        <input
          type="text"
          name="title"
          placeholder="Thread Title*"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        
        <textarea
          name="text_content"
          placeholder="Thread Content*"
          value={formData.text_content}
          onChange={handleInputChange}
          rows="6"
          required
        />
      </div>

      
      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Creating..." : "Create Thread"}
      </button>
    </form>
  );
};

export default CreateThreadAdmin;
