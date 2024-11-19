import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api";
import "./Admin.css";

const GroupsEdit = () => {
  const { pk } = useParams(); // Use pk to extract the ID from the URL

  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [username, setUsername] = useState("");

  const [editingGroup, setEditingGroup] = useState(null); // Track which transaction is being edited
  const [tempValue, setTempValue] = useState(""); // Temporary value during editing
  const [fieldBeingEdited, setFieldBeingEdited] = useState(""); // Track which field is being edited

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  
  // Handle deletion of selected groups
  const handleDeleteSelected = async () => {
    if (selectedGroups.length === 0) {
      alert("Please select groups to delete.");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected groups?"
    );
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/custom_admin/groups/batch-delete/`, {
        data: { group_ids: selectedGroups },
      });

      setTransactions(
        groups.filter(
          (group) => !selectedGroups.includes(group.id)
        )
      );
      setSelectedGroups([]); // Clear selection
    } catch (err) {
      console.error(err);

      if (err.response.status === 403) {
        navigate("/login");
      }
      setError("Failed to delete transactions");
    }
  };
  const handleDoubleClick = (groupId, currentValue, field) => {
    setEditingGroup(groupId); // Встановлюємо ID групи, яка редагується
    setTempValue(currentValue); // Задаємо поточне значення для редагування
    setFieldBeingEdited(field); // Задаємо поле, яке редагується
  };
  
  const handleInputChange = (e) => {
    setTempValue(e.target.value); // Оновлюємо тимчасове значення при зміні
  };
  
  const handleSaveEdit = async (groupId) => {
    try {
        // Створюємо payload із оновленим значенням
        let updatedValue = tempValue.trim();
        if (fieldBeingEdited === "name" && updatedValue === "") {
            updatedValue = "No group name"; // Установлюємо значення за замовчуванням
        }

        const payload = { [fieldBeingEdited]: updatedValue };

        // Оновлюємо на сервері
        await api.put(`/api/custom_admin/groups/${groupId}/`, payload);

        // Оновлюємо в локальному стані
        setGroups((prevGroups) =>
            prevGroups.map((group) =>
                group.id === groupId
                    ? { ...group, [fieldBeingEdited]: updatedValue } // Використовуємо updatedValue
                    : group
            )
        );

        setEditingGroup(null); // Вихід із режиму редагування
        setFieldBeingEdited(""); // Очищення поля, яке редагується
    } catch (err) {
        console.error("Failed to update group", err);
        setError("Failed to update group"); // Встановлюємо повідомлення про помилку
    }
};

  
  // Toggle selection of a group
  const toggleGroupSelection = (id) => {
    setSelectedGroups((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((groupId) => groupId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get(
          `/api/custom_admin/users/${pk}/groups/`
        );

        const usernameResponse = await api.get(
          `/api/custom_admin/users/${pk}/username/`
        );

        setUsername(usernameResponse.data.username);

        setGroups(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [pk]); // Use pk as a dependency to fetch the correct user

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p>{error}</p>;

  if (groups.length === 0) {
    return (
      <>
        <div className="admin-main-buttons">
          <h1 className="admin-header">{username}'s Groups</h1>
          <h1 className="admin-header">No groups were found</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-main-buttons">
        <h1 className="admin-header">{username}'s Groups</h1>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedGroups.length === 0}
        >
          Delete Selected
        </button>
        <ul className="admin-userlist">
          {groups.map((group) => (
            <li key={group.id} className="admin-useritem">
              <input
                type="checkbox"
                checked={selectedGroups.includes(group.id)}
                onChange={() => toggleGroupSelection(group.id)}
              />
              <h1 className="admin-user-label">NAME:</h1>
              {editingGroup === group.id && fieldBeingEdited === "name" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={handleInputChange}
                  onBlur={() => handleSaveEdit(group.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(group.id);
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="admin-user-value"
                  onDoubleClick={() =>
                    handleDoubleClick(group.id, group.name, "name")
                  }
                >
                  {group.name}
                </h2>
              )}
              
              <h1 className="admin-user-label">DESCRIPTION:</h1>
              {editingGroup === group.id && fieldBeingEdited === "description" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={handleInputChange}
                  onBlur={() => handleSaveEdit(group.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(group.id);
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="admin-user-value"
                  onDoubleClick={() =>
                    handleDoubleClick(group.id, group.description, "description")
                  }
                >
                  {group.description || "Descrioption is empty"}
                </h2>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default GroupsEdit;
