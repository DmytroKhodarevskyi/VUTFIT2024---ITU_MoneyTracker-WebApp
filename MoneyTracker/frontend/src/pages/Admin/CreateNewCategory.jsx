import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";


const CreateNewCategory = () => {
  const { pk } = useParams(); 
  const [formData, setFormData] = useState({
    name: "",
    color: "#000000",
    
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
  
    try {
      const payload = {
        name: formData.name.trim(),
        color: formData.color,
      };
  
      await api.post(`/api/custom_admin/user/${pk}/categories/`, payload);
      alert("Category created successfully!");
      navigate(`/custom-admin/users/${pk}/categories`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        
        const errorMessage = error.response.data?.name?.[0] || "An error occurred while creating the category.";
        alert(errorMessage);
      } else {
        console.error("Error creating category:", error.response || error.message);
        alert(
          `Error: ${
            error.response?.data?.detail || "An error occurred while creating the category."
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="admin-main">
      <h1 className="admin-header">Create New Category</h1>

      <div className="admin-input-container">
        <input
          type="text"
          name="name"
          placeholder="Category Name*"
          value={formData.name}
          onChange={handleInputChange}
          
          required
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
  );
};

export default CreateNewCategory;
