import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import "./Admin.css";

const PublicationComments = () => {
  const { pk } = useParams(); // Отримуємо ID публікації з URL
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/api/custom_admin/publications/${pk}/comments/`);
        console.log("Publication ID from URL:", pk);
        console.log("Comments API Response:", response.data);
        setComments(response.data);
      } catch (err) {
        console.error("Failed to load comments:", err);
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [pk]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;
  if (comments.length === 0) return <p>No comments found for this publication.</p>;

  return (
    <div className="admin-main-buttons">
      <h1 className="admin-user-label">Comments for Publication {pk}</h1>
      <ul className="admin-userlist">
        {comments.map((comment) => (
          <li key={comment.id} className="admin-useritem">
            <h1 className="admin-user-label">Comment Text:</h1>
            <h2 className="admin-user-value">{comment.text}</h2>

            <h1 className="admin-user-label">Author:</h1>
            <h2 className="admin-user-value">{comment.author}</h2>

            <h1 className="admin-user-label">Stars:</h1>
            <h2 className="admin-user-value">{comment.stars}</h2>

            
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default PublicationComments;
