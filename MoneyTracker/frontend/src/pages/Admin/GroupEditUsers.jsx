import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import "./Admin.css";

const GroupUsers = () => {
  const { pk } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [fieldBeingEdited, setFieldBeingEdited] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const fetchUsers = async () => {
    try {
      const response = await api.get(`/api/custom_admin/groups/${pk}/users/`);
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pk]);

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleSaveEdit = async (userId) => {
    try {
      let updatedValue = tempValue;

      
      if (typeof updatedValue === "string") {
        updatedValue = updatedValue.trim();
      }

      const payload = { [fieldBeingEdited]: updatedValue };

      await api.put(`/api/custom_admin/groups/users/${userId}/`, payload);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, [fieldBeingEdited]: updatedValue } : user
        )
      );

      setEditingUser(null);
      setFieldBeingEdited("");
    } catch (err) {
      console.error("Failed to update user", err);
      setError("Failed to update user");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select users to delete.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete the selected users?");
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/custom_admin/groups/users/batch-delete/`, {
        data: { user_ids: selectedUsers },
      });

      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUsers.includes(user.id))
      );
      setSelectedUsers([]);
    } catch (err) {
      console.error("Failed to delete users", err);
      setError("Failed to delete users");
    }
  };

  const toggleUserSelection = (id) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDoubleClick = (userId, currentValue, field) => {
    setEditingUser(userId);
    setTempValue(currentValue);
    setFieldBeingEdited(field);
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;
  if (users.length === 0) {
    return (
      <div className="admin-main-buttons">
        <h1 className="admin-header">No users were found</h1>
      </div>
    );
  }

  return (
    <div className="admin-main-buttons">
      <h1 className="admin-header">Users in Group</h1>
      <button
        onClick={handleDeleteSelected}
        disabled={selectedUsers.length === 0}
      >
        Delete Selected
      </button>
      <ul className="admin-userlist">
        {users.map((user) => (
          <li key={user.id} className="admin-useritem">
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.id)}
              onChange={() => toggleUserSelection(user.id)}
            />
            
            <h1 className="admin-user-label">Username:</h1>
            <h2 className="admin-user-value">{user.username || "Unknown Username"}</h2>
            <h1 className="admin-user-label">Role:</h1>
            {editingUser === user.id && fieldBeingEdited === "role" ? (
              <select
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => handleSaveEdit(user.id)}
                autoFocus
              >
                <option value="member">Member</option>
                <option value="moderator">Moderator</option>
              </select>
            ) : (
              <h2
                className="admin-user-value"
                onDoubleClick={() =>
                  handleDoubleClick(user.id, user.role, "role")
                }
              >
                {user.role}
              </h2>
            )}
            <h1 className="admin-user-label">Banned:</h1>
            {editingUser === user.id && fieldBeingEdited === "is_banned" ? (
              <select
                value={tempValue.toString()}
                onChange={(e) => setTempValue(e.target.value === "true")}
                onBlur={() => handleSaveEdit(user.id)}
                autoFocus
              >
                <option value="false">Not Banned</option>
                <option value="true">Banned</option>
              </select>
            ) : (
              <h2
                className="admin-user-value"
                onDoubleClick={() =>
                  handleDoubleClick(user.id, user.is_banned.toString(), "is_banned")
                }
              >
                {user.is_banned ? "Banned" : "Not Banned"}
              </h2>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupUsers;
