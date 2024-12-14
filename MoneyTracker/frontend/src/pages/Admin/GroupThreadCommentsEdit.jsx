/**
 * File: GroupThreadCommentsEdit.jsx
 * Description: A page for managing comments in a specific thread. Administrators can view, edit, and delete comments.
 * Author: Rostyslav Kachan
 * 
 * Notes:
 * - 
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import "./Admin.css";
import ConfirmModal from "../../components/ConfirmModel/ConfirmModal";
import Notification from "../../components/Notifications/Notifications";

const ThreadComments = () => {
  const { pk } = useParams(); 
  const [comments, setComments] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [threadTitle, setThreadTitle] = useState("Unknown");
  const [tempValue, setTempValue] = useState("");
  const [fieldBeingEdited, setFieldBeingEdited] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null); 
  

  const closeNotification = () => {
    setNotification(null); 
  };
  const cancelDelete = () => {
    setShowModal(false); 
  };
  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/custom_admin/thread/${pk}/comments/`);
      const commentsWithAuthors = await Promise.all(
        response.data.map(async (comment) => {
          const authorResponse = await api.get(`/api/custom_admin/users/${comment.author}/username/`);
          return { ...comment, authorName: authorResponse.data.username };
        })
      );
      setComments(commentsWithAuthors);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

 
  const fetchThreadTitle = async () => {
    try {
      const response = await api.get(`/api/custom_admin/thread/${pk}/`);
      setThreadTitle(response.data.title || "Unknown");
    } catch (err) {
      console.error("Failed to load thread title:", err);
      setThreadTitle("Unknown");
    }
  };

  useEffect(() => {
    fetchComments();
    fetchThreadTitle();
  }, [pk]);

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      let updatedValue = tempValue.trim();

      if (fieldBeingEdited === "text_content" && updatedValue === "") {
        updatedValue = "No content"; 
      }

      const payload = { [fieldBeingEdited]: updatedValue };
      await api.put(`/api/custom_admin/thread/comments/${commentId}/update/`, payload);

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, [fieldBeingEdited]: updatedValue }
            : comment
        )
      );

      setEditingComment(null);
      setFieldBeingEdited("");
    } catch (err) {
      console.error("Failed to update comment", err);
      setError("Failed to update comment");
    }
  };

  const handleDeleteSelected = async () => {
    console.log("Selected Comment IDs to delete:", selectedComments);
    if (selectedComments.length === 0) {
      
      setNotification({
        message: "Please select comments to delete.",
        type: "error",
      });
      return;
    }
    setShowModal(true);
  };    
  const confirmDelete = async () => {
      setShowModal(false); 
    try {
      const response = await api.delete(`/api/custom_admin/thread/comments/batch-delete/`, {
        data: { comment_ids: selectedComments },
      });

      console.log("Server Response:", response.data);

      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.filter((comment) => !selectedComments.includes(comment.id))
        );
        setSelectedComments([]);
      } else {
        console.error("Failed to delete comments from the server.");
        setError("Failed to delete comments from the server.");
      }
    } catch (err) {
      console.error("Error during comment deletion:", err);
      setError("Failed to delete comments");
    }
  };

  const toggleCommentSelection = (id) => {
    setSelectedComments((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((commentId) => commentId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDoubleClick = (commentId, currentValue, field) => {
    setEditingComment(commentId);
    setTempValue(currentValue || "");
    setFieldBeingEdited(field);
  };

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;
  if (comments.length === 0) {
    return (
      <div className="admin-main-buttons">
        <h1 className="admin-header">No comments were found</h1>
      </div>
    );
  }

  return (
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
          message="Are you sure you want to delete the selected comments?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      <h1 className="admin-header">Comments for Thread "{threadTitle}"</h1>
      <button
        onClick={handleDeleteSelected}
        disabled={selectedComments.length === 0}
      >
        Delete Selected
      </button>
      <ul className="admin-userlist">
        {comments.map((comment) => (
          <li key={comment.id} className="admin-useritem">
            <input
              type="checkbox"
              checked={selectedComments.includes(comment.id)}
              onChange={() => toggleCommentSelection(comment.id)}
            />
            <h1 className="admin-user-label">Author ID:</h1>
            <h2 className="admin-user-value">{comment.authorName}</h2>

            <h1 className="admin-user-label">Comment Text:</h1>
            {editingComment === comment.id && fieldBeingEdited === "text_content" ? (
              <input
                type="text"
                value={tempValue}
                onChange={handleInputChange}
                onBlur={() => handleSaveEdit(comment.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(comment.id);
                }}
                autoFocus
              />
            ) : (
              <h2
                className="admin-user-value"
                onDoubleClick={() =>
                  handleDoubleClick(comment.id, comment.text_content, "text_content")
                }
              >
                {comment.text_content || "No content"}
              </h2>
            )}

            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadComments;
