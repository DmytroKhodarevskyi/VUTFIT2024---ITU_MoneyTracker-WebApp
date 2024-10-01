import React, { useState } from "react";
import "../styles/FormPost.css";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from 'react-router-dom'

function CreatePost() {  
  
  const navigate = useNavigate();


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
        <h1>Create a New Post</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="title">Post Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="text">Post Text:</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your post content"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="media">Upload Image or Video:</label>
            <input
              type="file"
              id="media"
              accept="image/*, video/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated):</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags (e.g., technology, news)"
            />
          </div>

          <button type="submit">Create Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;