import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api";
import "./Admin.css";
import ColorPicker from "../../components/NewCategory/ColorPicker";

const CategoriesEdit = () => {
  const { pk } = useParams(); // Use pk to extract the ID from the URL

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [username, setUsername] = useState("");

  const [editingCategory, setEditingCategory] = useState(null); // Track which category is being edited
  const [tempValue, setTempValue] = useState(""); // Temporary value during editing
  const [fieldBeingEdited, setFieldBeingEdited] = useState(""); // Track which field is being edited
  const [colorPickerOpen, setColorPickerOpen] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleDoubleClick = (categoryId, currentValue, field) => {
    setEditingCategory(categoryId);
    setTempValue(currentValue);
    setFieldBeingEdited(field);
  };

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleSaveEdit = async (categoryId) => {
    try {
      // Create a payload with the updated field
      let updatedValue = tempValue.trim();
      if (fieldBeingEdited === "name" && updatedValue === "") {
        updatedValue = "No category name";
      }

      
      const payload = { [fieldBeingEdited]: updatedValue };

      // Update on the server
      await api.put(`/api/custom_admin/categories/${categoryId}/`, payload);

      // Update in local state
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId
            ? { ...category, [fieldBeingEdited]: updatedValue }
            : category
        )
      );

      setEditingCategory(null); // Exit editing mode
      setFieldBeingEdited(""); // Clear field tracking
      setColorPickerOpen(null);
    } catch (err) {
      console.error("Failed to update category", err);
      setError("Failed to update category");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select categories to delete.");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected categories?"
    );
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/custom_admin/categories/batch-delete/`, {
        data: { category_ids: selectedCategories },
      });

      setCategories(
        categories.filter((category) => !selectedCategories.includes(category.id))
      );
      setSelectedCategories([]); // Clear selection
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
  }, [pk]); // Use pk as a dependency to fetch the correct user

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  if (categories.length === 0) {
    return (
      <>
        <div className="admin-main-buttons">
          <h1 className="admin-header">{username}'s Categories</h1>
          <h1 className="admin-header">No categories were found</h1>
        </div>
      </>
    );
  }

  const handleColorChange = async (categoryId, newColor) => {
    try {
      // Створюємо об'єкт payload для відправки на сервер
      const payload = { color: newColor };
  
      // Оновлення кольору на сервері
      await api.put(`/api/custom_admin/categories/${categoryId}/`, payload);
  
      // Оновлення локального стану
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId ? { ...category, color: newColor } : category
        )
      );
  
      setColorPickerOpen(null); // Закриваємо колорпікер
    } catch (err) {
      console.error("Failed to update category color", err);
      setError("Failed to update category color");
    }
  };
  

  return (
    <>
      <div className="admin-main-buttons">
        <h1 className="admin-header">{username}'s Categories</h1>
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
               {/* COLOR */}
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
            top: "30px", // Зміщення вниз, щоб розташувати під квадратом
            left: "0",
            zIndex: 100,
            background: "#fff", // Фон для уникнення прозорості
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
