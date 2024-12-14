/**
 * File: CreateNewThread.jsx
 * Description: A page for creating a new thread within a specific group. It allows admin to input a thread title and content, validates the inputs, and submits the data to the backend.
 * Author: Rostyslav Kachan
 * 
 * Notes:
 * -
 */
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import Notification from "../../components/Notifications/Notifications";

const CreateThreadAdmin = () => {
  const { pk } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    text_content: "",
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null); 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const closeNotification = () => {
    setNotification(null); 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!formData.title.trim()) {
      
      setNotification({
        message: "Thread title is required.",
        type: "error",
      });
      setLoading(false);
      return;
    }
  
    if (!formData.text_content.trim()) {
      
      setNotification({
        message: "Thread content is required.",
        type: "error",
      });
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
      
      setNotification({
        message: "Thread created successfully!",
        type: "success",
      });
      setTimeout(() => {
      navigate(`/custom-admin/groups/${pk}/threads`);},2000);
    } catch (error) {
      console.error("Error creating thread:", error.response || error.message);
      const errorMessage =error.response?.data?.detail || "An error occurred while creating the thread.";
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="admin-main">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <h1 className="admin-header">Create New Thread</h1>

      <div className="admin-input-container">
        
        <input
          type="text"
          name="title"
          placeholder="Thread Title*"
          value={formData.title}
          onChange={handleInputChange}
          
        />

        
        <textarea
          name="text_content"
          placeholder="Thread Content*"
          value={formData.text_content}
          onChange={handleInputChange}
          rows="6"
          
        />
      </div>

      
      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Creating..." : "Create Thread"}
      </button>
    </form>
  );
};

export default CreateThreadAdmin;
