import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "./Admin.css";

const ThreadsEdit = () => {
  const { pk } = useParams(); 
  const [threads, setThreads] = useState([]);
  const [selectedThreads, setSelectedThreads] = useState([]);
  const [editingThread, setEditingThread] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [fieldBeingEdited, setFieldBeingEdited] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchThreads = async () => {
    try {
      const response = await api.get(`/api/custom_admin/groups/${pk}/threads/`);
      setThreads(response.data);
    } catch (err) {
      console.error("Failed to load threads:", err);
      setError("Failed to load threads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [pk]);

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleSaveEdit = async (threadId) => {
    try {
      let updatedValue;
      if (fieldBeingEdited === "title") {
        updatedValue = tempValue.trim() === "" ? "No title" : tempValue.trim();
      } else if (fieldBeingEdited === "text_content") {
        updatedValue =
          tempValue.trim() === "" ? "No content" : tempValue.trim();
      } else {
        updatedValue = tempValue.trim();
      }

      const payload = { [fieldBeingEdited]: updatedValue };
      await api.put(`/api/custom_admin/groups/threads/${threadId}/update/`, payload);

      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === threadId
            ? { ...thread, [fieldBeingEdited]: updatedValue }
            : thread
        )
      );

      setEditingThread(null);
      setFieldBeingEdited("");
    } catch (err) {
      console.error("Failed to update thread", err);
      setError("Failed to update thread");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedThreads.length === 0) {
      alert("Please select threads to delete.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete the selected threads?");
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/custom_admin/groups/threads/batch-delete`, {
        data: { thread_ids: selectedThreads },
      });

      setThreads(
        threads.filter((thread) => !selectedThreads.includes(thread.id))
      );
      setSelectedThreads([]);
    } catch (err) {
      console.error("Failed to delete threads:", err);
      setError("Failed to delete threads");
    }
  };

  const handleGoToComments = () => {
    if (selectedThreads.length === 0) {
      alert("Please select one  thread.");
      return;
    }
  
    if (selectedThreads.length > 1) {
      alert("Please select only one  thread.");
      return;
    }
  
    const threadId = selectedThreads[0]; 
    
  
    if (!threadId) {
      alert("Something went wrong. Please try again.");
      return;
    }
  
    navigate(`/custom-admin/thread/${threadId}/comments/`);
  };

  const toggleThreadSelection = (id) => {
    setSelectedThreads((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((threadId) => threadId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDoubleClick = (threadId, currentValue, field) => {
    setEditingThread(threadId);
    setTempValue(currentValue || "");
    setFieldBeingEdited(field);
  };

  if (loading) return <p>Loading threads...</p>;
  if (error) return <p>{error}</p>;
  if (threads.length === 0) {
    return (
      <div className="admin-main-buttons">
        <h1 className="admin-header">No threads were found</h1>
      </div>
    );
  }

  return (
    <div className="admin-main-buttons">
      <h1 className="admin-header">Threads in Group</h1>
      <button
        onClick={handleDeleteSelected}
        disabled={selectedThreads.length === 0}
      >
        Delete Selected
      </button>
      <button
        onClick={handleGoToComments}
        disabled={selectedThreads.length === 0}
      >
        Thread Comments
      </button>
      <ul className="admin-userlist">
        {threads.map((thread) => (
          <li key={thread.id} className="admin-useritem">
            <input
              type="checkbox"
              checked={selectedThreads.includes(thread.id)}
              onChange={() => toggleThreadSelection(thread.id)}
            />

            <h1 className="admin-user-label">Title:</h1>
            {editingThread === thread.id && fieldBeingEdited === "title" ? (
              <input
                type="text"
                value={tempValue}
                onChange={handleInputChange}
                onBlur={() => handleSaveEdit(thread.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(thread.id);
                }}
                autoFocus
              />
            ) : (
              <h2
                className="admin-user-value"
                onDoubleClick={() =>
                  handleDoubleClick(thread.id, thread.title, "title")
                }
              >
                {thread.title || "No title"}
              </h2>
            )}

            <h1 className="admin-user-label">Content:</h1>
            {editingThread === thread.id && fieldBeingEdited === "text_content" ? (
              <textarea
                value={tempValue}
                onChange={handleInputChange}
                onBlur={() => handleSaveEdit(thread.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(thread.id);
                }}
                autoFocus
              />
            ) : (
              <h2
                className="admin-user-value"
                onDoubleClick={() =>
                  handleDoubleClick(thread.id, thread.text_content, "text_content")
                }
              >
                {thread.text_content || "No content"}
              </h2>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadsEdit;
