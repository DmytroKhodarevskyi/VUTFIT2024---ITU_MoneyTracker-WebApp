import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api";
import "./Admin.css";

const PublicationsEdit = () => {
  const { pk } = useParams();

  const [publications, setPublications] = useState([]);
  const [selectedPublications, setSelectedPublications] = useState([]);

  const [username, setUsername] = useState("");

  const [editingPublication, setEditingPublication] = useState(null); // Track which publication is being edited
  const [tempValue, setTempValue] = useState(""); // Temporary value during editing
  const [fieldBeingEdited, setFieldBeingEdited] = useState(""); // Track which field is being edited

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleDoubleClick = (publicationId, currentValue, field) => {
    setEditingPublication(publicationId);
    setTempValue(currentValue || ""); // Default to empty string if currentValue is null or undefined
    setFieldBeingEdited(field);
  };

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleSaveEdit = async (publicationId) => {
    try {
      // Перевіряємо та обробляємо значення для "title" і "stars"
      let updatedValue;
  
      if (fieldBeingEdited === "title") {
        // Якщо поле "title" порожнє, записуємо "No title"
        updatedValue = tempValue.trim() === "" ? "No title" : tempValue.trim();
      } else if (fieldBeingEdited === "stars") {
        // Якщо поле "stars" порожнє, записуємо 0, але дозволяємо мінусові значення
        updatedValue =
          tempValue.trim() === "" || isNaN(tempValue) ? 0 : Number(tempValue);
      } else {
        // Для інших полів просто записуємо значення
        updatedValue = tempValue.trim();
      }
  
      // Створюємо payload із новим значенням
      const payload = { [fieldBeingEdited]: updatedValue };
  
      // Оновлюємо значення на сервері
      await api.put(`/api/custom_admin/publications/${publicationId}/update/`, payload);
  
      // Оновлюємо значення в локальному стані
      setPublications((prevPublications) =>
        prevPublications.map((publication) =>
          publication.id === publicationId
            ? { ...publication, [fieldBeingEdited]: updatedValue }
            : publication
        )
      );
  
      setEditingPublication(null); // Вихід із режиму редагування
      setFieldBeingEdited(""); // Очищення поля
    } catch (err) {
      console.error("Failed to update publication", err);
      setError("Failed to update publication");
    }
  };
  

  const handleDeleteSelected = async () => {
    if (selectedPublications.length === 0) {
      alert("Please select publications to delete.");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected publications?"
    );
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/custom_admin/publications/batch-delete/`, {
        data: { publication_ids: selectedPublications },
      });

      setPublications(
        publications.filter(
          (publication) => !selectedPublications.includes(publication.id)
        )
      );
      setSelectedPublications([]);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        navigate("/login");
      }
      setError("Failed to delete publications");
    }
  };

  const handleGoToComments = () => {
    if (selectedPublications.length === 0) {
      alert("Please select one publication to view comments.");
      return;
    }
  
    if (selectedPublications.length > 1) {
      alert("Please select only one publication to view comments.");
      return;
    }
  
    const publicationId = selectedPublications[0]; // Вибираємо перший ID
    console.log("Selected Publication ID:", publicationId); // Лог для перевірки
  
    if (!publicationId) {
      alert("Something went wrong. Please try again.");
      return;
    }
  
    navigate(`/custom-admin/publications/${publicationId}/comments`);
  };
  
  

  const togglePublicationSelection = (id) => {
    setSelectedPublications((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((publicationId) => publicationId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await api.get(
          `/api/custom_admin/users/${pk}/publications/`
        );

        const usernameResponse = await api.get(
          `/api/custom_admin/users/${pk}/username/`
        );

        setUsername(usernameResponse.data.username);

        setPublications(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load publications");
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [pk]);

  if (loading) return <p>Loading publications...</p>;
  if (error) return <p>{error}</p>;

  if (publications.length === 0) {
    return (
      <>
        <div className="admin-main-buttons">
          <h1 className="admin-header">{username}'s Publications</h1>
          <h1 className="admin-header">No publications were found</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-main-buttons">
        <h1 className="admin-header">{username}'s Publications</h1>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedPublications.length === 0}
        >
          Delete Selected
        </button>
        <button
          onClick={handleGoToComments}
          disabled={selectedPublications.length === 0}
        >
          Publication Comment
        </button>
        <h1 className="admin-user-label">!!! Stars must be positive number</h1>
        <ul className="admin-userlist">
          {publications.map((publication) => (
            <li key={publication.id} className="admin-useritem">
              <input
                type="checkbox"
                checked={selectedPublications.includes(publication.id)}
                onChange={() => togglePublicationSelection(publication.id)}
              />
              
              <h1 className="admin-user-label">TITLE:</h1>
              {editingPublication === publication.id && fieldBeingEdited === "title" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={handleInputChange}
                  onBlur={() => handleSaveEdit(publication.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(publication.id);
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="admin-user-value"
                  onDoubleClick={() =>
                    handleDoubleClick(publication.id, publication.title, "title")
                  }
                >
                  {publication.title || "No title"}
                </h2>
              )}

              <h1 className="admin-user-label">TAGS:</h1>
              {editingPublication === publication.id && fieldBeingEdited === "tags" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={handleInputChange}
                  onBlur={() => handleSaveEdit(publication.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(publication.id);
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="admin-user-value"
                  onDoubleClick={() =>
                    handleDoubleClick(publication.id, publication.tags, "tags")
                  }
                >
                  {publication.tags || "No tags"}
                </h2>
              )}

              <h1 className="admin-user-label">CONTENT:</h1>
              {editingPublication === publication.id && fieldBeingEdited === "content_text" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={handleInputChange}
                  onBlur={() => handleSaveEdit(publication.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(publication.id);
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="admin-user-value"
                  onDoubleClick={() =>
                    handleDoubleClick(publication.id, publication.content_text, "content_text")
                  }
                >
                  {publication.content_text || "No text"}
                </h2>
              )}

              <h1 className="admin-user-label">STARS:</h1>
              {editingPublication === publication.id && fieldBeingEdited === "stars" ? (
                <input
                  type="number"
                  value={tempValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0) {
                      setTempValue(value); 
                    }
                  }}
                  onBlur={() => handleSaveEdit(publication.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(publication.id);
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="admin-user-value"
                  onDoubleClick={() =>
                    handleDoubleClick(publication.id, publication.stars, "stars")
                  }
                >
                  {publication.stars || "0"}
                </h2>
              )}
              
            </li>
            
          ))}
          
        </ul>
      </div>
    </>
  );
};

export default PublicationsEdit;
