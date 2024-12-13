import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import Notification from "../../components/Notifications/Notifications";

const CreateNewCategory = () => {
  const { pk } = useParams(); 
  const [formData, setFormData] = useState({
    name: "",
    color: "#000000",
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

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

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      
      setNotification({
        message: "Category name is required.",
        type: "error",
      });
      setLoading(false);
      return;
    }
    try {
      const payload = {
        name: formData.name.trim(),
        color: formData.color,
      };

      await api.post(`/api/custom_admin/user/${pk}/categories/`, payload);
      setNotification({
        message: "Category created successfully!",
        type: "success",
      });

      
      setTimeout(() => {
        navigate(`/custom-admin/users/${pk}/categories`);
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage =
          error.response.data?.name?.[0] || "An error occurred while creating the category.";
        setNotification({
          message: errorMessage,
          type: "error",
        });
      } else {
        setNotification({
          message: "An unexpected error occurred. Please try again.",
          type: "error",
        });
        console.error("Error creating category:", error.response || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <form onSubmit={handleSubmit} className="admin-main">
        <h1 className="admin-header">Create New Category</h1>
        <div className="admin-input-container">
          <input
            type="text"
            name="name"
            placeholder="Category Name*"
            value={formData.name}
            onChange={handleInputChange}
            
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            className="picker-container"
            htmlFor="color"
            style={{
              color: "white",
              fontSize: "28px",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Select Color
          </label>
          <input
            type="color"
            name="color"
            id="color"
            value={formData.color}
            onChange={handleInputChange}
            style={{
              display: "block",
              width: "60px",
              height: "40px",
              border: "none",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          />
        </div>

        <button
          type="submit"
          className="form-button"
          disabled={loading}
          style={{
            display: "block",
            marginTop: "10px",
          }}
        >
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default CreateNewCategory;
