import React from 'react';
import { useState, useEffect } from "react"
import "../styles/MyFeedCard.css";
import star_picture from "./star.svg";
import comment_picture from "./comment.svg";

function MyFeedCard ({
    profileImg, 
    fullname, 
    publication,
    onSwipe,
}) 
{


    const { title, content_text, content_media, tags } = publication; 

    const baseUrl = import.meta.env.VITE_API_URL;
    const fullImageUrl = profileImg ? `${baseUrl}${profileImg}` : `${baseUrl}media/profile_images/default.png`;

    const fullContentMediaUrl = content_media && content_media.startsWith('http')
    ? content_media
    : `${baseUrl}${content_media}`;

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
                <div className="post-name">{title || "Untitled Post"}</div>
                    <p>{content_text || "No content available."}</p>
                    {content_media && (
                         <img src={fullContentMediaUrl} alt="Publication media" className="post-media" />
                    )}
                    <div className='tag-container'>
                      <span className='post-tags'>Tags: </span>
                      {tags  ? (
                        tags.split(' ').map((tag, index) => (
                          <span key={index} className="post-hashtag">#{tag} </span>
                        ))
                      ) : (
                        <span className='post-hashtag'>None</span>
                      )}
                    </div>
            </div>
            <div className="post-footer">
              <div className="post-actions">
                <button className="like-button">
                      I Like this! <span className="like-count">3</span> 
                      <img src={star_picture} alt="Star" className="star-icon" />
                  </button>

                  <button className="comment-button">
                      Comment <span className="comment-count">3</span> 
                      <img src={comment_picture} alt="Comment" className="comment-icon" />
                </button>
              </div>
              <button className="edit-button">
                Edit
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    export default MyFeedCard;