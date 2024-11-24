import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "./NavigationContext";
import "./FeedPost.css";
import star_picture from "../../assets/star.svg";
import comment_picture from "../../assets/comment.svg";
import api from "../../api";

function FeedPost({
  publication,
  IsCenter,
  IsLeft,
  IsRight,
  shouldDisplay,
  handleComment,

}) {
  const { id, author, title, content_text, media_files, tags, stars, isLiked} = publication;

  const [Name, setName] = useState("");
  const [Surname, setSurname] = useState("");

  const [starsCount, setStars] = useState(stars);
  const [liked, setLiked] = useState(isLiked);

  const [commentCount, setCommentCount] = useState(0);


  const [profileImg, setProfileImg] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [CardStyle, setCardStyle] = useState({});

  const [TextConatinerStyle, setTextContainerStyle] = useState({});

  const postRef = useRef(null);
  const { handlePrevious, handleNext } = useNavigation(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setStars(publication.stars); 
  }, [publication]);

 
  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleLike = async () => {
    if (isLiking) return; 

    setIsLiking(true);
    try {
        if (liked) {
            await api.delete(`/api/publications/${publication.id}/unlike/`);
            setLiked(false);
            setStars((prevCount) => prevCount - 1);
        } else {
            await api.post(`/api/publications/${publication.id}/like/`);
            setLiked(true);
            setStars((prevCount) => prevCount + 1);
        }
    } catch (error) {
      if (error.response?.data?.error_code === "self_like") {
        alert("You cannot like your own publication.");
    }
   } finally {
        setIsLiking(false); 
    }
};
  const openModal = (image) => {
    if (Disabled)
      return;
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const handleClick = () => {
      if (IsLeft) {
        console.log("Clicked left post");
        handlePrevious(); 
      } else if (IsRight) {
        console.log("Clicked right post");
        handleNext(); 
      }
    };

    const post = postRef.current;
    if (post) {
      post.addEventListener("click", handleClick);
    }

    return () => {
      if (post) {
        post.removeEventListener("click", handleClick);
      }
    };
  }, [IsLeft, IsRight, handlePrevious, handleNext]);


  if (!shouldDisplay) {
    return <div className="FeedPost-card-container" style={CardStyle}></div>;
  }


  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await api.get(`/api/user/profile/${author.id}/`);


        setName(response.data.first_name);
        setSurname(response.data.last_name);
        setProfileImg(response.data.profileImg);
      } catch (error) {
        console.error("Failed to fetch author", error);
      }
    };

    fetchAuthor();
  }, []);

  useEffect(() => {
    const fetchCommentCount = async () => {
        try {
          
            const response = await api.get(`/api/publications/${publication.id}/comments/`);
            setCommentCount(response.data.length);
        } catch (error) {
            console.error(error);
        } finally {
          setIsLoaded(false);
        }
    };

    fetchCommentCount();
}, []); 



  const Disabled = IsLeft || IsRight ? true : false;

  useEffect(() => {
    if (media_files && media_files.length > 0) {
      console.log("SETTING TEXT CONTAINER STYLE");

      setTextContainerStyle({
        maxHeight: "200px",
      });
    } else {
      setTextContainerStyle({});
    }

    if (IsCenter) {
      setCardStyle({
        backgroundColor: "#FFFFFF",
        zIndex: 10,
        boxShadow: "rgba(20, 33, 61, 0.1) 0px 4px 10px",
      });
    } else if (IsLeft) {
      setCardStyle({
        marginRight: "-200px",
        backgroundColor: "#FCFCFC",
        zIndex: 5,
        transform: "scale(0.96)",
        transformOrigin: "bottom left",
        width: "60%",
        left: "0%",
        filter: "blur(1px)",

        overflow: "hidden",
      });
    } else if (IsRight) {
      setCardStyle({
        marginLeft: "-200px",
        backgroundColor: "#FCFCFC",
        zIndex: 5,
        transformOrigin: "right",
        width: "60%",
        transform: "scale(0.96)",
        transformOrigin: "bottom right",
        filter: "blur(1px)",

        overflow: "hidden",
      });
    } else {
      setCardStyle({
        backgroundColor: "#FCFCFC",
        zIndex: 1,
        opacity: 0.5,
        transform: "scale(0.8)",
      });
    }
  }, [IsCenter, IsLeft, IsRight]);

  const baseUrl = import.meta.env.VITE_API_URL;


  return (
    

    <div
      className="FeedPost-card-container"
      style={CardStyle}
      onClick={
        IsLeft ? handlePrevious : IsRight ? handleNext : IsCenter ? null : null
      }
    >
      <div className="FeedPost-card-top">
        <div className="FeedPost-card-header">
          <div className="FeedPost-card-profile-image">
            <img
              src={profileImg}
              alt={`profile img`}
              className="FeedPost-profile-image"
              draggable="false"
            />
          </div>
          <div className="FeedPost-card-author">
            <p
              unselectable={Disabled ? "on" : "off"}
              className="FeedPost-card-fullname"
            >
              {Name} {Surname}
            </p>
          </div>
        </div>
        <div className="FeedPost-card-content">
          <div className="FeedPost-card-texttoppart">
            <div className="FeedPost-card-name">{title || "Untitled Post"}</div>
            <p className="FeedPost-content-text" style={TextConatinerStyle}>
              {content_text || "No content available."}
            </p>
          </div>
        

          {media_files && media_files.length > 0 && (
            <div className="FeedPost-media-container">
              {media_files.map((mediaItem, index) => (
                <div key={index} className="FeedPost-media-item">
                  {mediaItem.media_type === "image" && (
                    <img
                      src={mediaItem.file}
                      alt={`Publication image ${index}`}
                      className="FeedPost-media-image"
                      onClick={() => openModal(mediaItem.file)}
                      draggable="false"
                      style={Disabled ? { cursor: "default" } : {}}
                    />
                  )}
                  {mediaItem.media_type === "video" && (
                    <video controls className="my-feed-post-video">
                      <source src={mediaItem.file} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {mediaItem.media_type === "gif" && (
                    <img
                      src={mediaItem.file}
                      alt={`Publication GIF ${index}`}
                      className="FeedPost-media-image"
                      style={Disabled ? { cursor: "default" } : {}}
                      onClick={() => openModal(mediaItem.file)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="FeedPost-card-footer">
        <div className="FeedPost-tag-container">
          <span className="FeedPost-card-tags">Tags: </span>
          {tags ? (
            tags.split(" ").map((tag, index) => (
              <span key={index} className="FeedPost-card-hashtag">
                #{tag}{" "}
              </span>
            ))
          ) : (
            <span className="FeedPost-card-hashtag">None</span>
          )}
        </div>

        <div className="FeedPost-card-actions">
        <button
          onClick={handleLike}
          disabled={Disabled || isLiking} 
          className={Disabled || isLiking ? "FeedPost-like-button disabled" : "FeedPost-like-button"}
      >
          <p>{liked ? "Unlike" : "I Like this!"}</p>
          <div className="FeedPost-amounticon-container">
              <span className="FeedPost-like-count">{starsCount}</span>
              <img src={star_picture} alt="Star" className="FeedPost-star-icon" />
          </div>
      </button>

          <button
            disabled={Disabled}
            className={
              Disabled
                ? "FeedPost-comment-button disabled"
                : "FeedPost-comment-button"
            }
            onClick={() => handleComment(id)}
          >
            <p>Comment</p>
            <div className="FeedPost-amounticon-container">
              <span className="FeedPost-comment-count">{commentCount}</span>
              <img
                src={comment_picture}
                alt="Comment"
                className="FeedPost-comment-icon"
              />
            </div>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="FeedPost-modal-overlay" onClick={closeModal}>
          <div className="FeedPost-modal-content"
          style={{
            WebkitUserSelect: 'none', 
            msUserSelect: 'none', 
            userSelect: 'none', 
          }}
          onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Full-size publication" className="FeedPost-fullsize-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedPost;
