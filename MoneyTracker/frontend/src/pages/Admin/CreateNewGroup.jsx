import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const CreateGroupAdmin = () => {
  const { pk } = useParams(); 
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      alert("Group name is required.");
      setLoading(false);
      return;
    }

    
    const nameExists = await checkGroupName(trimmedName);
    if (nameExists) {
      alert("Group with this name already exists. Please choose another name.");
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
      alert("Group created successfully!");
      navigate(`/custom-admin/users/${pk}/groups`);
    } catch (error) {
      console.error("Error creating group:", error.response || error.message);
      alert(
        `Error: ${
          error.response?.data?.detail || "An error occurred while creating the group."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-main">
      <h1 className="admin-header">Create New Group</h1>

      <div className="admin-input-container">
        <input
          type="text"
          name="name"
          placeholder="Group Name*"
          value={formData.name}
          onChange={handleInputChange}
          required
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
