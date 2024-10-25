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
  onClick,
}) {
  const { author, title, content_text, content_media, tags, stars } =
    publication;

  const [Name, setName] = useState("");
  const [Surname, setSurname] = useState("");

  const [profileImg, setProfileImg] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const [CardStyle, setCardStyle] = useState({});

  const postRef = useRef(null);
  const { handlePrevious, handleNext } = useNavigation(); // Use the context to get navigation functions

  useEffect(() => {
    const handleClick = () => {
      if (IsLeft) {
        console.log("Clicked left post");
        handlePrevious(); // Call the previous function from context
      } else if (IsRight) {
        console.log("Clicked right post");
        handleNext(); // Call the next function from context
      }
      // Center post doesn’t need any click handler
    };

    const post = postRef.current;
    if (post) {
      post.addEventListener("click", handleClick);
    }

    // Clean up listener
    return () => {
      if (post) {
        post.removeEventListener("click", handleClick);
      }
    };
  }, [IsLeft, IsRight, handlePrevious, handleNext]);
  //     useEffect(() => {
  //       console.log(`Post ID: ${publication.id}, shouldDisplay: ${shouldDisplay}`);
  //   }, [shouldDisplay, publication.id]);

  if (!shouldDisplay) {
    return <div className="FeedPost-card-container" style={CardStyle}></div>;
  }

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await api.get(`/api/user/profile/${author.id}/`);
        // console.log("Author response firstname - " + response.data.first_name);
        // console.log("Author response lastname - " + response.data.last_name);

        setName(response.data.first_name);
        setSurname(response.data.last_name);
        setProfileImg(response.data.profileImg);
      } catch (error) {
        console.error("Failed to fetch author", error);
      }
    };

    fetchAuthor();
  }, []);

  const Disabled = IsLeft || IsRight ? true : false;

  useEffect(() => {
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
  // const fullImageUrl = profileImg ? `${baseUrl}${profileImg}` : `${baseUrl}media/profile_images/default.png`;

  const fullContentMediaUrl =
    content_media && content_media.startsWith("http")
      ? content_media
      : `${baseUrl}${content_media}`;

  return (
    // <div className="FeedPost-card-main-container"
    //     style={ContainerStyle}>

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
          <div className="FeedPost-card-name">{title || "Untitled Post"}</div>
          <p className="FeedPost-content-text">
            {content_text || "No content available."}
          </p>
          {content_media && (
            <img
              src={fullContentMediaUrl}
              alt="Publication media"
              className="FeedPost-card-media"
            />
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
            disabled={Disabled}
            className={
              Disabled
                ? "FeedPost-like-button disabled"
                : "FeedPost-like-button"
            }
          >
            <p> I Like this! </p>

            <div className="FeedPost-amounticon-container">
              <span className="FeedPost-like-count">{stars}</span>
              <img
                src={star_picture}
                alt="Star"
                className="FeedPost-star-icon"
              />
            </div>
          </button>

          <button
            disabled={Disabled}
            className={
              Disabled
                ? "FeedPost-comment-button disabled"
                : "FeedPost-comment-button"
            }
          >
            <p>Comment</p>
            <div className="FeedPost-amounticon-container">
              <span className="FeedPost-comment-count">3</span>
              <img
                src={comment_picture}
                alt="Comment"
                className="FeedPost-comment-icon"
              />
            </div>
          </button>
        </div>
      </div>
    </div>

    // </div>

    // <div className="post-container">
    //   <div className="post-card">
    //     <div className="post-header">
    //       <div className="post-profile-image">
    //         <img src={profileImg} alt={`profile img`} className="profile-image" draggable="false" />
    //       </div>
    //       <div className="post-author">
    //         <p className="post-fullname">{Name} {Surname}</p>
    //       </div>
    //     </div>
    //     <div className="post-content">
    //         <div className="post-name">{title || "Untitled Post"}</div>
    //             <p>{content_text || "No content available."}</p>
    //             {content_media && (
    //                  <img src={fullContentMediaUrl} alt="Publication media" className="post-media" />
    //             )}
    //             <div className='tag-container'>
    //               <span className='post-tags'>Tags: </span>
    //               {tags  ? (
    //                 tags.split(' ').map((tag, index) => (
    //                   <span key={index} className="post-hashtag">#{tag} </span>
    //                 ))
    //               ) : (
    //                 <span className='post-hashtag'>None</span>
    //               )}
    //             </div>
    //     </div>

    //     <div className="post-footer">
    //       <div className="post-actions">
    //         <button className="like-button">
    //               I Like this! <span className="like-count">{stars}</span>
    //               <img src={star_picture} alt="Star" className="star-icon" />
    //         </button>

    //         <button className="comment-button">
    //               Comment <span className="comment-count">3</span>
    //               <img src={comment_picture} alt="Comment" className="comment-icon" />
    //         </button>
    //       </div>

    //     </div>
    //   </div>
    // </div>
  );
}

export default FeedPost;
