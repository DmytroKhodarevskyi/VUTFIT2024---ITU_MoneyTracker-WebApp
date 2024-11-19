import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react"
import api from "../../api"
import MainContainer from "../../components/MainContainer/MainContainer"
import TopPart from "../../components/TopPart/TopPart";
import ThreadDetailComment from "./ThreadDetailComment.jsx";
import "./ThreadDetail.css";

function ThreadDetail() {
  const location = useLocation();
  const { thread } = location.state || {}; 

  const [profileData, setProfileData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0); 

  const [newCommentContent, setNewCommentContent] = useState("");
  const [newCommentFile, setNewCommentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
        try {

            const [response, photoResponse, commentsResponse] = await Promise.all([
                api.get("/api/user/profile_detail/"),
                api.get("/api/user/profile/"),        
                api.get(`/api/groups/threads_comments/${thread.id}/comments/`),      
            ]);

            setProfileData(response.data);
            setProfilePhoto(photoResponse.data.profileImg);
            setComments(commentsResponse.data);
            setCommentsCount(commentsResponse.data.length); 
 
                
        } catch (error) {
    
        }
    }
    fetchData();
}, []);



const handleFileChange = (e) => {
    setNewCommentFile(e.target.files[0]);
  };

  const handleSubmitComment = async () => {
    
    if (newCommentFile && newCommentFile.length > 1) {
      alert("You can only upload one file.");
      return; 
    }

    if(!newCommentContent.trim()) {
      alert("Comment text cannot be empty");
      return;
    }
  
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("text_content", newCommentContent);
    formData.append("thread", thread.id)
    
    if (newCommentFile) formData.append("media_file", newCommentFile);
    
    try {
      await api.post(`/api/groups/threads_comments/${thread.id}/create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
   
      setNewCommentContent("");
      setNewCommentFile(null);
    
      const commentsResponse = await api.get(`/api/groups/threads_comments/${thread.id}/comments/`);
      setComments(commentsResponse.data); 
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (confirmed) {
      try {
        await api.delete(`/api/groups/threads_comments/${commentId}/delete/`);
        alert("Comment deleted successfully.");

        const updatedComments = comments.filter((comment) => comment.id !== commentId);
        setComments(updatedComments);
        setCommentsCount(updatedComments.length);
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete the comment.");
      }
    }
  };

  return (
    <MainContainer>
    <TopPart nickname={profileData?.firstname} selectedItem={"groups"} profilePhoto={profilePhoto} />
    
    <div className="ThreadDetail-main-container">
        <div className="ThreadDetail-head-thread">
      <div className="ThreadDetail-title-description-container">
        <h1 className="ThreadDetail-title">{thread.title}</h1>
        <p className="ThreadDetail-description">{thread.text_content}</p>
      </div>

      {thread.media_file && (
        <div className="ThreadDetail-image-container">
          <img
            draggable="false"
            className="ThreadDetail-image"
            src={thread.media_file}
            alt="thread"
          />
        </div>
      )}
    </div>

    <div className="ThreadDetail-thread-comments-container">
    {comments &&
          comments.map((comment) => (
            <ThreadDetailComment
              key={comment.id}
              comment={comment}
              onDelete={() => handleDelete(comment.id)}
              group={thread.group}
              userID={profileData.id}
            />
        ))}
      </div>

    
    <div className="ThreadDetail-new-thread-section">
        <div className="ThreadDetail-title-description-container">
          <textarea
            className="ThreadDetail-input-content"
            placeholder="Enter your thread comment*"
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          />
        </div>

        <div className="ThreadDetail-image-upload-container">
          <input type="file" onChange={handleFileChange} />
          {newCommentFile && (
            <p className="ThreadDetail-uploaded-file-name">{newCommentFile.name}</p>
          )}
        </div>

        <button
          className="ThreadDetail-submit-button"
          onClick={handleSubmitComment}
          disabled={isSubmitting}
        > 
          {isSubmitting ? "Submitting..." : "New Thread Comment"}
        </button>
      </div>
    </div>
    </MainContainer>
    );
}

export default ThreadDetail;