import React, { useState } from 'react';
import api from "../../api"
import "./CommentPopUpCard.css"
import { useNavigate } from "react-router-dom";
import Notification from '../Notifications/Notifications';

const CommentPopUpCard = ({ isOpen, onClose, publicationId, onCommentAdded }) => {
    const [commentText, setCommentText] = useState('');
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        
        if (commentText.trim() === "") {
            setNotification({
                message: "Comment can't be empty.",
                type: "error",
            });
            return; 
        }

        try {
            
            const response = await api.post(`/api/publications/${publicationId}/comments/create/`, {
                text: commentText,
            });

            
            setCommentText('');
            onCommentAdded(response.data);
            onClose();
        } catch (error) {
            console.error("Error creating comment:", error);

            
            setNotification({
                message: "Failed to create the comment. Please try again.",
                type: "error",
            });
        }
    };

    const closeNotification = () => {
        setNotification(null); 
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}
            <div className="modal-content">
                <h2>Create Comment</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment here...*"
                      
                        className="modal-textarea"
                    />
                    <div className="modal-buttons">
                        <button type="submit" className="modal-submit-button">Submit</button>
                        <button type="button" className="modal-cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};



export default CommentPopUpCard;
