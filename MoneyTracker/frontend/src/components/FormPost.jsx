import React, { useState } from "react";
import "../styles/FormPost.css";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from 'react-router-dom'
import gif_icon from "../assets/gif_icon.svg";
import img_icon from "../assets/img_icon.svg";
import video_icon from "../assets/video_icon.svg";


function FormPost({
  fullname,
  profileImg
}
) 
  {  
  
  const navigate = useNavigate();

  const emojiArray = new Array(24).fill('😊');
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null); 
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newPost = new FormData();
    newPost.append("title", title);
    newPost.append("content_text", text);
    if(media) {
      newPost.append("content_media", media);
    }
    newPost.append("tags", tags);


    try {
      const res = await api.post("/api/publications/", newPost, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`, 
        },
      });
      console.log("Post created:", res.data);

      navigate("/my-feed");
  } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response);
        const errorMessage = error.response.data.detail || "Something went wrong.";
        setError(errorMessage); 
      } else {
        console.error("Error message:", error.message);
        setError("Network error. Please try again."); 
      }
    } finally {
      setLoading(false); 
    }
  };
  

  return (
    <div className="create-post-container">
      <div className="create-post">
        <div className="post-head">
          <img src={profileImg} alt={fullname} className="post-profile-image" />
          <p className="post-fullname">{fullname}</p>
        </div>

        <form className="post-form-container" onSubmit={handleSubmit} encType="multipart/form-data">
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

          <div className="post-tags-form">
            <label htmlFor="post-form-tags"></label>
            <input
              type="text"
              id="post-form-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags (comma separated)"
            />
          </div>
        </form>
      </div>
      <div className="form-sidebar">
        <div className="form-buttons-container">
          <button className="post-button">Post</button>
          <button className="post-discard-button">Discard</button>
        </div>
        <div className="form-files-container">
          <button className="post-action-buttons"><img src={gif_icon} alt="GIF Icon"/></button>
          <button className="post-action-buttons"><img src={img_icon} alt="IMG Icon"/></button>
          <button className="post-action-buttons"><img src={video_icon} alt="VIDEO Icon"/></button>
        </div>
        <div className="emoji-grid-container">
            {emojiArray.map((emoji, index) => (
              <div key={index} className="emoji-box">
                <span className="emoji">{emoji}</span>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default FormPost;