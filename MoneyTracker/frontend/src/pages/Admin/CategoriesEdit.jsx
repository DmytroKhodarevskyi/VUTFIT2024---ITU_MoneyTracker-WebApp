import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api";
import "./Admin.css";

const CategoriesEdit = () => {
  const { pk } = useParams(); // Use pk to extract the ID from the URL

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleDeleteSelected = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select Categories to delete.");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected Categories?"
    );
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/custom_admin/categories/batch-delete/`, {
        data: { categories_ids: selectedCategories },
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
      setError("Failed to delete Categories");
    }
  };

  const toggleCategorySelection = (id) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((CategoryId) => CategoryId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(
          `/api/custom_admin/users/${pk}/categories/`
        );

        const username = await api.get(
          `/api/custom_admin/users/${pk}/username/`
        );

        setUsername(username.data.username);

        setCategories(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [pk]); // Use pk as a dependency to fetch the correct user

  if (loading) return <p>Loading Categories...</p>;
  if (error) return <p>{error}</p>;

  if (categories.length === 0) {
    return (
      <>
        <div className="admin-main-buttons">
          <h1 className="admin-header">{username}'s Categories</h1>
          <h1 className="admin-header">No categories was found</h1>
        </div>
      </>
    );
  }

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
              <h2 className="admin-user-value">{category.name}</h2>
              {/* COlOR */}
              <h1 className="admin-user-label">COLOR:</h1>
              <h2 className="admin-user-value">{category.color}</h2>
              <div
                className="color-square"
                style={{
                  backgroundColor: category.color,
                  width: "20px",
                  height: "20px",
                  border: "1px solid white",
                  display: "inline-block",
                  marginRight: "10px",
                }}
              ></div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CategoriesEdit;
