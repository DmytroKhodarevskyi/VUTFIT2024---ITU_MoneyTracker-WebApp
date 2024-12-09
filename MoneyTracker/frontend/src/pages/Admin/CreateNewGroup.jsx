import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import Notification from "../../components/Notifications/Notifications";

const CreateGroupAdmin = () => {
  const { pk } = useParams(); 
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const closeNotification = () => {
    setNotification(null); 
  };

  const checkGroupName = async (name) => {
    try {
      const response = await api.get(`/api/custom_admin/groups/check-name/`, {
        params: { name },
      });

      return response.data.exists; 
    } catch (error) {
      console.error("Error checking group name:", error);
      return false; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      
      setNotification({
        message: "Group name is required.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    
    const nameExists = await checkGroupName(trimmedName);
    if (nameExists) {
      
      setNotification({
        message: "Group with this name already exists. Please choose another name.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const payload = {
      name: trimmedName,
      description: formData.description.trim(),
    };

    console.log("Payload:", payload);

    try {
      await api.post(`/api/custom_admin/user/${pk}/groups/`, payload);
      
      setNotification({
        message: "Group created successfully!",
        type: "success",
      });
      setTimeout(() => {
      navigate(`/custom-admin/users/${pk}/groups`);},2000);
    } catch (error) {
      console.error("Error creating group:", error.response || error.message);
      const errorMessage = error.response?.data?.detail || "An error occurred while creating the group.";
      
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
      <h1 className="admin-header">Create New Group</h1>

      <div className="admin-input-container">
        <input
          type="text"
          name="name"
          placeholder="Group Name*"
          value={formData.name}
          onChange={handleInputChange}
         
        />

        <textarea
          name="description"
          placeholder="Group Description (optional)"
          value={formData.description}
          onChange={handleInputChange}
          rows="6"
        />
      </div>

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Creating..." : "Create Group"}
      </button>
    </form>
  );
};

export default CreateGroupAdmin;
