import React from 'react';
import { useState, useEffect } from "react"
import "../styles/MyFeedCard.css";
import star_picture from "./star.svg";
import comment_picture from "./comment.svg";

function MyFeedCard ({
    profileImg, 
    fullname, 
}) 
{

    const [likes, setLikes] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [postContent, setPostContent] = useState('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Cras elementum. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Vestibulum fermentum tortor id mi. Mauris metus.');
  

    const baseUrl = import.meta.env.VITE_API_URL;
    const fullImageUrl = profileImg ? `${baseUrl}${profileImg}` : `${baseUrl}media/profile_images/default.png`;

    const handleLike = () => {
        setLikes(likes + 1);
      };
    
      const toggleEdit = () => {
        setIsEditing(!isEditing);
      };
    
      const handleContentChange = (e) => {
        setPostContent(e.target.value);
      };
    
      return (
        <div className="post-container">
          <div className="post-card">
            <div className="post-header">
              <div className="post-profile-image">
                <img src={fullImageUrl} alt={`${fullname}'s profile`} className="profile-image" draggable="false" />
              </div>
              <div className="post-author">
                <p className="post-fullname">{fullname}</p>
              </div>
            </div>    
            <div className="post-content">
                <div className="post-name">
                    Lorem ipsum
                </div>
                {isEditing ? (
                  <textarea value={postContent} onChange={handleContentChange} className="edit-textarea" />
                ) : (
                  <p>{postContent}</p>
                )}
              <div className="post-tags">
                  Tags: <span className="post-hashtag">#region</span> 
              </div>
           </div>
            <div className="post-footer">
              <div className="post-actions">
                <button className="like-button" onClick={handleLike}>
                      I Like this! <span className="like-count">{likes}</span> 
                      <img src={star_picture} alt="Star" className="star-icon" />
                  </button>

                  <button className="comment-button" onClick={handleLike}>
                      Comment <span className="comment-count">3</span> 
                      <img src={comment_picture} alt="Comment" className="comment-icon" />
                </button>
              </div>
              <button className="edit-button" onClick={toggleEdit}>
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    export default MyFeedCard;