import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../api";
import "./Admin.css";
import ColorPicker from "../../components/NewCategory/ColorPicker";
import Notification from "../../components/Notifications/Notifications";
import ConfirmModal from "../../components/ConfirmModel/ConfirmModal";

const CategoriesEdit = () => {
  const { pk } = useParams(); 

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempValue, setTempValue] = useState(""); 
  const [fieldBeingEdited, setFieldBeingEdited] = useState(""); 
  const [colorPickerOpen, setColorPickerOpen] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleDoubleClick = (categoryId, currentValue, field) => {
    setEditingCategory(categoryId);
    setTempValue(currentValue);
    setFieldBeingEdited(field);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleSaveEdit = async (categoryId) => {
    try {
      
      let updatedValue = tempValue.trim();
      if (fieldBeingEdited === "name" && updatedValue === "") {
        updatedValue = "No category name";
      }

      
      const payload = { [fieldBeingEdited]: updatedValue };

     
      await api.put(`/api/custom_admin/categories/${categoryId}/`, payload);

      
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId
            ? { ...category, [fieldBeingEdited]: updatedValue }
            : category
        )
      );

      setEditingCategory(null); 
      setFieldBeingEdited(""); 
      setColorPickerOpen(null);
    } catch (err) {
      console.error("Failed to update category", err);
      setError("Failed to update category");
    }
  };
  const cancelDelete = () => {
    setShowModal(false); 
  };
  const handleDeleteSelected = async () => {
    if (selectedCategories.length === 0) {
      
      setNotification({
        message: "Please select categories to delete.",
        type: "error",
      });
      return;
    }
    setShowModal(true); 
  }
    
  const confirmDelete = async () => {
      setShowModal(false); 
    try {
      await api.delete(`/api/custom_admin/categories/batch-delete/`, {
        data: { category_ids: selectedCategories },
      });

      setCategories(
        categories.filter((category) => !selectedCategories.includes(category.id))
      );
      setSelectedCategories([]); 
    } catch (err) {
      console.error(err);

      if (err.response.status === 403) {
        navigate("/login");
      }
      setError("Failed to delete categories");
    }
  };

  const toggleCategorySelection = (id) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((categoryId) => categoryId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`/api/custom_admin/users/${pk}/categories/`);

        const usernameResponse = await api.get(
          `/api/custom_admin/users/${pk}/username/`
        );

        setUsername(usernameResponse.data.username);

        setCategories(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [pk]); 

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  if (categories.length === 0) {
    return (
      <>
        <div className="admin-main-buttons">
          <h1 className="admin-header">{username}'s Categories</h1>
          <h1 className="admin-header">No categories were found</h1>
          <Link to={`/custom-admin/user/${pk}/create-category/`}>
          <button>Create Category</button> 
          </Link>
        </div>
      </>
    );
  }

  const handleColorChange = async (categoryId, newColor) => {
    try {
      
      const payload = { color: newColor };
  
      
      await api.put(`/api/custom_admin/categories/${categoryId}/`, payload);
  
      
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId ? { ...category, color: newColor } : category
        )
      );
  
      setColorPickerOpen(null);
    } catch (err) {
      console.error("Failed to update category color", err);
      setError("Failed to update category color");
    }
  };
  

  return (
    <>
      <div className="admin-main-buttons">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      {showModal && (
        <ConfirmModal
          message="Are you sure you want to delete the selected categories?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
        <h1 className="admin-header">{username}'s Categories</h1>
        <Link to={`/custom-admin/user/${pk}/create-category/`}>
      <button>Create Category</button> 
        </Link>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedCategories.length === 0}
        >
          Delete Selected
        </button>
        
        <ul className="admin-userlist">
          {categories.map((category) => (
            <li key={category.id} className="admin-useritem">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => toggleCategorySelection(category.id)}
              />
              <h1 className="admin-user-label">NAME:</h1>
              {editingCategory === category.id && fieldBeingEdited === "name" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={handleInputChange}
                  onBlur={() => handleSaveEdit(category.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(category.id);
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="admin-user-value"
                  onDoubleClick={() =>
                    handleDoubleClick(category.id, category.name, "name")
                  }
                >
                  {category.name}
                </h2>
              )}
               
    <h1 className="admin-user-label">COLOR:</h1>
    <h2 className="admin-user-value">{category.color}</h2>
    <div
      className="picker-container"
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <div
        className="color-square"
        style={{
          backgroundColor: category.color,
          width: "20px",
          height: "20px",
          border: "1px solid white",
          cursor: "pointer",
        }}
        onClick={() =>
          setColorPickerOpen(colorPickerOpen === category.id ? null : category.id)
        }
      ></div>
      {colorPickerOpen === category.id && (
        <div
          style={{
            position: "absolute",
            top: "30px", 
            left: "0",
            zIndex: 100,
            background: "#fff", 
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            padding: "10px",
          }}
        >
          <ColorPicker
            color={category.color}
            onChange={(newColor) => handleColorChange(category.id, newColor)}
          />
          
        </div>
      )}
    </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CategoriesEdit;
