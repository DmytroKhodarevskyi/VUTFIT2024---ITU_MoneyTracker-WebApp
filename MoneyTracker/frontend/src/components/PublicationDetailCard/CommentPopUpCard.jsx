import React, { useState } from 'react';
import api from "../../api"

const CommentPopUpCard = ({ isOpen, onClose, publicationId, onCommentAdded }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
           
            const response = await api.post(`/api/publications/${publicationId}/comments/create/`, {
                text: commentText,
            });

            
            setCommentText('');
            
            onCommentAdded(response.data);
           
            onClose(); 
        } catch (error) {
            console.error("Error creating comment:", error);
            
        }
    };


    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create Comment</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment here..."
                        required
                    />
                    <div className="modal-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentPopUpCard;
