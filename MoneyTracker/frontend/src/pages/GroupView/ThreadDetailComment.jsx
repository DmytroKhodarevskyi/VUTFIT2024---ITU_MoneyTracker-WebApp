import React from "react";
import "./ThreadDetailComment.css";
import { useState, useEffect } from "react"
import api from "../../api";

function ThreadDetailComment({ comment  }) {

  const [profileCommentAuthorData, setProfileCommentAuthorData] = useState(null);
  const [profileCommentAuthorPhoto, setProfileCommentAuthorPhoto] = useState(null);
  const [authorFullname, setAuthorFullname] = useState("")
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/api/user/profile/${comment.author}/`);
        
        setProfileCommentAuthorData(response.data);
        setProfileCommentAuthorPhoto(response.data.profileImg);
        setAuthorFullname(response.data.first_name + " " + response.data.last_name);

        setIsLoading(false); 
      } catch (error) {
        setIsLoading(false);
        console.log("Failed to fetch data profile");
      }
    }
    fetchData();
  }, [comment.author]);

  
  if (isLoading) {
    return (
      <div className="ThreadDetailComment-main-container">
        <p>Loading...</p>
      </div>
    );
  }



  return (
    <div className="ThreadDetailComment-main-container">

      <div className="ThreadDetailComment-author-section">
          <div className="ThreadDetailComment-author-image-container">
            <img src={profileCommentAuthorPhoto} alt="Author's profile" className="ThreadDetailComment-author-photo" />
          </div>
          <div className="ThreadDetailComment-author-name">
          <p>{authorFullname}
          </p>
          </div>
      </div>

      <div className="ThreadDetailComment-title-description-container">
        <p className="ThreadDetailComment-description">{comment.text_content}</p>
      </div>

      {comment.media_file && (
        <div className="ThreadDetailComment-image-container">
          <img
            draggable="false"
            className="ThreadDetailComment-image"
            src={comment.media_file}
            alt="thread"
          />
        </div>
      )}
    </div>
  );
}

export default ThreadDetailComment;