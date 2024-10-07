import React from 'react';
import "../styles/MyFeedCard.css";
import star_picture from "../assets/star.svg";

function MyFeedCard ({
    profileImg, 
    fullname, 
    publication,
    mediaFiles,
    handleNewPost,
    handleEditPost,
    handleDeletePost,
}) 
{

      if (!publication) {
        return (
            <div className="post-container">
                <div className="post-card">
                    <p className="my-feed-no-publication-message">No publications available.</p>
                </div>
                <div className="my-feed-sidebar">
                    <div className="my-feed-buttons-container">
                        <button className="my-feed-create-button" onClick={handleNewPost}>Create Post</button>
                    </div>
                </div>
            </div>
        );
    }
    const { title, content_text, content_media, tags } = publication; 

    const baseUrl = import.meta.env.VITE_API_URL;
    const fullImageUrl = profileImg ? `${baseUrl}${profileImg}` : `${baseUrl}media/profile_images/default.png`;



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

                    {mediaFiles && mediaFiles.length > 0 && (
                    <div className="my-feed-media-container">
                        {mediaFiles.map((mediaItem, index) => (
                            <div key={index} className="my-feed-media-item">
                                {mediaItem.media_type === 'image' && (
                                    <img 
                                        src={mediaItem.file} 
                                        alt={`Publication image ${index}`} 
                                        className="my-feed-post-media" 
                                    />
                                )}
                                {mediaItem.media_type === 'video' && (
                                    <video controls className="my-feed-post-video">
                                        <source src={mediaItem.file} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                {mediaItem.media_type === 'gif' && (
                                    <img 
                                        src={mediaItem.file} 
                                        alt={`Publication GIF ${index}`} 
                                        className="my-feed-post-gif" 
                                    />
                                )}
                            </div>
                        ))}
                    </div>
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
                <button className="my-feed-like-button">
                      <span className="my-feed-like-count">3</span> 
                      <img src={star_picture} alt="Star" className="my-feed-star-icon" />
                  </button>
              </div>
            </div>
          </div>
          <div className="my-feed-sidebar">
                <div className="my-feed-buttons-container">
                  <button className="my-feed-edit-button" onClick={() => handleEditPost(publication.id)}>Edit Post</button>
                  <button className="my-feed-delete-button" onClick={() => handleDeletePost(publication.id)}> Delete</button> 
                </div>
                <div className="my-feed-create-container">
                        <button className='my-feed-create-button' onClick={handleNewPost}> Create Post</button>

                </div>
            </div>
        </div>
      );
    }
    
    export default MyFeedCard;  