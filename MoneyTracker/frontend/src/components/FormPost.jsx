import React from "react";
import "../styles/FormPost.css";
import gif_icon from "../assets/gif_icon.svg";
import img_icon from "../assets/img_icon.svg";
import video_icon from "../assets/video_icon.svg";


function FormPost({
  fullname,
  profileImg,
  title,
  text,
  media,
  tags,
  imageInputRef,
  gifInputRef,
  videoInputRef,
  handleDiscard,
  handleFileChange,
  handleUploadPhoto,
  handleUploadGif,
  handleUploadVideo,
  handleSubmit,
  handleRemoveFile,
  setTitle,  
  setText,   
  handleTagChange,
  handleKeyDown,   
  addEmoji,
  emojiArray,
}
) 
  {  

  return (
    <div className="create-post-container">
      <div className="create-post">
        <div className="post-head">
          <img src={profileImg} alt={fullname} className="post-profile-image" />
          <p className="post-fullname">{fullname}</p>
        </div>

        <form className="post-form-container">
          <div className="post-title-form">
            <label htmlFor="post-form-title"></label>
            <input
              type="text"
              id="post-form-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
          </div>

          <div className="post-text-form">
            <label htmlFor="post-form-text"></label>
            <textarea
              id="post-form-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your Thoughts..."
              required
            ></textarea>
          </div>

          <div className="form-post-selected-media">
          {media.map((mediaItem, index) => {
            console.log(mediaItem);

            return (
                <div 
                    key={index} 
                    className="post-form-media-file" 
                    onClick={() => handleRemoveFile(index)} 
                >
                    {mediaItem.file.type.startsWith('image') && (
                        <img src={mediaItem.url} alt={mediaItem.file.name} className="post-form-media-preview" />
                    )}
                    {mediaItem.file.type.startsWith('video') && (
                        <video src={mediaItem.url} controls className="post-form-media-preview" />
                    )}
                    {mediaItem.file.type === 'gif' && (
                        <img src={mediaItem.url} alt={mediaItem.file.name} className="post-form-media-preview" />
                    )}
                </div>
            );
        })}
      </div>

          <div className="post-tags-form">
            <label htmlFor="post-form-tags"></label>
            <input
              type="text"
              id="post-form-tags"
              value={tags}
              onChange={handleTagChange}
              onKeyDown={handleKeyDown} 
              placeholder="Enter tags (space separated)"
            />
          </div>
        </form>
      </div>
      <div className="post-form-sidebar">
        <div className="form-buttons-container">

        <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }} 
            multiple
          />
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }} 
            multiple
          />
          <input
            type="file"
            accept=".gif"
            ref={gifInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }} 
            multiple
          />

          <button className="post-button" onClick={handleSubmit}>Post</button>
          <button className="post-discard-button" onClick={handleDiscard}>Discard</button>
        </div>
        <div className="form-files-container">
          <button className="post-action-buttons" onClick={handleUploadGif}><img src={gif_icon} alt="GIF Icon"/></button>
          <button className="post-action-buttons" onClick={handleUploadPhoto}><img src={img_icon} alt="IMG Icon"/></button>
          <button className="post-action-buttons" onClick={handleUploadVideo}><img src={video_icon} alt="VIDEO Icon"/></button>
        </div>
        <div className="emoji-grid-container">
            {emojiArray.map((emoji, index) => (
              <div key={index} 
                   className="emoji-box"
                   onClick={() => addEmoji(emoji)}>
                <span className="emoji">{emoji}</span>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default FormPost;