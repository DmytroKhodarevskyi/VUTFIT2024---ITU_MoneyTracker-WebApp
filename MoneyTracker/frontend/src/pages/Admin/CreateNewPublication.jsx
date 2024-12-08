import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import Notification from "../../components/Notifications/Notifications";

const CreateNewPublication = () => {
  const { pk } = useParams(); 
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    content_text: "",
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
        message: "Publication title is required.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    
    const tagArray = formData.tags.split(/\s+/).map((tag) => tag.trim()).filter((tag) => tag);
    const uniqueTags = Array.from(new Set(tagArray)); 
    const validTagRegex = /^[A-Za-z0-9\-.]+$/; 
    const invalidTags = tagArray.filter((tag) => !validTagRegex.test(tag));

    if (invalidTags.length > 0) {
      
      setNotification({
        message: "Tags can only contain letters, numbers, hyphens (-), and periods (.)",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      tags: uniqueTags.join(" "),
      content_text: formData.content_text.trim(),
    };

    console.log("Payload:", payload);

    try {
      await api.post(`/api/custom_admin/user/${pk}/publications/`, payload);
      setNotification({
        message: "Publication created successfully!",
        type: "success",
      });
      setTimeout(() => {
      navigate(`/custom-admin/users/${pk}/publications`);},2000);
    } catch (error) {
      console.error("Error creating publication:", error.response || error.message);
      const errorMessage = error.response?.data?.detail || "An error occurred while creating the publication.";
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

      <h1 className="admin-header">Create New Publication</h1>

      <div className="admin-input-container">
        
        <input
          type="text"
          name="title"
          placeholder="Publication Title*"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        
        <textarea
          name="content_text"
          placeholder="Publication Text (optional)"
          value={formData.content_text}
          onChange={handleInputChange}
          rows="6"
        />

        
        <input
          type="text"
          name="tags"
          placeholder="Tags (space-separated)"
          value={formData.tags}
          onChange={handleInputChange}
        />
      </div>

      
      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Creating..." : "Create Publication"}
      </button>
    </form>
  );
};

export default CreateNewPublication;
