/**
 * File: GroupsEdit.jsx
 * Description: A page for managing user groups. Administrators can view, edit, delete, and navigate to users and threads within a group.
 * Author: Rostyslav Kachan
 * 
 * Notes:
 * - 
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../api";
import "./Admin.css";
import ConfirmModal from "../../components/ConfirmModel/ConfirmModal";
import Notification from "../../components/Notifications/Notifications";

const GroupsEdit = () => {
  const { pk } = useParams(); 

  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null); 
  const [editingGroup, setEditingGroup] = useState(null); 
  const [tempValue, setTempValue] = useState(""); 
  const [fieldBeingEdited, setFieldBeingEdited] = useState(""); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  
  const closeNotification = () => {
    setNotification(null); 
  };
  const cancelDelete = () => {
    setShowModal(false); 
  };

  const handleDeleteSelected = async () => {
    if (selectedGroups.length === 0) {
      
      setNotification({
        message: "Please select groups to delete.",
        type: "error",
      });
      return;
    }
    setShowModal(true);
  };
    
    const confirmDelete = async () => {
      setShowModal(false);   
    try {
      await api.delete(`/api/custom_admin/groups/batch-delete/`, {
        data: { group_ids: selectedGroups },
      });
  
      
      setGroups(
        groups.filter((group) => !selectedGroups.includes(group.id))
      );
  
      setSelectedGroups([]); 
    } catch (err) {
      console.error(err);
  
      if (err.response.status === 403) {
        navigate("/login");
      }
      setError("Failed to delete groups");
    }
  };
  

  const handleGoToUsers = () => {
    if (selectedGroups.length === 0) {
      
      setNotification({
        message: "Please select one group to view users.",
        type: "error",
      });
      return;
    }
  
    if (selectedGroups.length > 1) {
      
      setNotification({
        message: "Please select only one group to view users.",
        type: "error",
      });
      return;
    }
  
    const groupId = selectedGroups[0]; 
    
  
    if (!groupId) {
      setNotification({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
      return;
    }
  
    navigate(`/custom-admin/groups/${groupId}/users/`);
  };

  const handleGoToThreads = () => {
    if (selectedGroups.length === 0) {
      
      setNotification({
        message: "Please select one group thread.",
        type: "error",
      });
      return;
    }
  
    if (selectedGroups.length > 1) {
      
      setNotification({
        message: "Please select only one group thread.",
        type: "error",
      });
      return;
    }
  
    const groupId = selectedGroups[0]; 
    
  
    if (!groupId) {
      
      setNotification({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
      return;
    }
  
    navigate(`/custom-admin/groups/${groupId}/threads/`);
  };

  const handleDoubleClick = (groupId, currentValue, field) => {
    setEditingGroup(groupId); 
    setTempValue(currentValue); 
    setFieldBeingEdited(field); 
  };
  
  const handleInputChange = (e) => {
    setTempValue(e.target.value); 
  };
  
  const handleSaveEdit = async (groupId) => {
    try {
        
        let updatedValue = tempValue.trim();
        if (fieldBeingEdited === "name" && updatedValue === "") {
            updatedValue = "No group name"; 
        }

        const payload = { [fieldBeingEdited]: updatedValue };

        
        await api.put(`/api/custom_admin/groups/${groupId}/`, payload);

        
        setGroups((prevGroups) =>
            prevGroups.map((group) =>
                group.id === groupId
                    ? { ...group, [fieldBeingEdited]: updatedValue } 
                    : group
            )
        );

        setEditingGroup(null); 
        setFieldBeingEdited(""); 
    } catch (err) {
        console.error("Failed to update group", err);
        setError("Failed to update group"); 
    }
};

  
 
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
  }, [pk]); 

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p>{error}</p>;

  if (groups.length === 0) {
    return (
      <>
        <div className="admin-main-buttons">
          <h1 className="admin-header">{username}'s Groups</h1>
          <h1 className="admin-header">No groups were found</h1>
          <Link to={`/custom-admin/user/${pk}/create-group/`}>
          <button>Create Group</button> 
          </Link>
        </div>
      </>
    );
  }

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
          message="Are you sure you want to delete the selected groups?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
        <h1 className="admin-header">{username}'s Groups</h1>
        <Link to={`/custom-admin/user/${pk}/create-group/`}>
      <button>Create Group</button> 
        </Link>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedGroups.length === 0}
        >
          Delete Selected
        </button>
        <button
          onClick={handleGoToUsers}
          disabled={selectedGroups.length === 0}
        >
          Group Users
        </button>
        <button
          onClick={handleGoToThreads}
          disabled={selectedGroups.length === 0}
        >
          Group Threads
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
