import React, { useState } from "react";
import "../styles/FormPost.css";

function CreatePost() {  
 

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null); 
  const [tags, setTags] = useState("");

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      title,
      text,
      media,
      tags: tags.split(",").map(tag => tag.trim()), 
    };

    console.log("Post created:", newPost);
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