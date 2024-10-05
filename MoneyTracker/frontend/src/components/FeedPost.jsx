import React from 'react';
import { useState, useEffect } from "react"
import "../styles/FeedPost.css";
import star_picture from "./star.svg";
import comment_picture from "./comment.svg";
import api from '../api';

function FeedPost ({ publication, IsCenter, IsLeft, IsRight, shouldDisplay }) {

    const {author, title, content_text, content_media, tags, stars } = publication; 

    const [Name, setName] = useState("")
    const [Surname, setSurname] = useState("")

    const [profileImg, setProfileImg] = useState(null)
    
    const [isLoaded, setIsLoaded] = useState(false);

    const [CardStyle, setCardStyle] = useState({});

    useEffect(() => {
      console.log(`Post ID: ${publication.id}, shouldDisplay: ${shouldDisplay}`);
  }, [shouldDisplay, publication.id]);

    if (!shouldDisplay) {
        return (
          <div className="FeedPost-card-container" 
              style={CardStyle}
          >
          </div>
        );
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
        }

        fetchAuthor();
    }, []);


  useEffect(() => {
    if (IsCenter) {
        setCardStyle({
            backgroundColor: '#FFFFFF',
            zIndex: 10,          
            'box-shadow': 'rgba(20, 33, 61, 0.1) 0px 4px 10px',
        });

    } else if (IsLeft) {
        setCardStyle({
            "margin-right": '-200px',
            backgroundColor: '#FCFCFC',
            zIndex: 5,
            transform: 'scale(0.96)',
            transformOrigin: 'bottom left',
            width: '60%',
            left: '0%',
            filter: 'blur(1px)',

            overflow: 'hidden',
        });


    } else if (IsRight) {
          setCardStyle({
            "margin-left": '-200px',
            backgroundColor: '#FCFCFC',
            zIndex: 5,
            transformOrigin: 'right',
            width: '60%',
            transform: 'scale(0.96)',
            transformOrigin: 'bottom right',
            filter: 'blur(1px)',

            overflow: 'hidden',

        });

    } else {
        setCardStyle({
            backgroundColor: '#FCFCFC',
            zIndex: 1,                        
            opacity: 0.5,                     
            transform: 'scale(0.8)',          
        });
    }
}, [IsCenter, IsLeft, IsRight]);


    const baseUrl = import.meta.env.VITE_API_URL;
    // const fullImageUrl = profileImg ? `${baseUrl}${profileImg}` : `${baseUrl}media/profile_images/default.png`;

    const fullContentMediaUrl = content_media && content_media.startsWith('http')
    ? content_media
    : `${baseUrl}${content_media}`;

      return (
      // <div className="FeedPost-card-main-container"
      //     style={ContainerStyle}>

        <div className="FeedPost-card-container" 
              style={CardStyle}
        >
              <div className="FeedPost-card-top">
                <div className="FeedPost-card-header">
                    <div className="FeedPost-card-profile-image">
                        <img src={profileImg} alt={`profile img`} className="FeedPost-profile-image" draggable="false" />
                    </div>
                    <div className="FeedPost-card-author">
                        <p className="FeedPost-card-fullname">{Name} {Surname}</p>
                    </div>
                </div>    
                <div className="FeedPost-card-content">
                    <div className="FeedPost-card-name">{title || "Untitled Post"}</div>
                        <p className='FeedPost-content-text'>{content_text || "No content available."}</p>
                        {content_media && (
                          <img src={fullContentMediaUrl} alt="Publication media" className="FeedPost-card-media" />
                        )}
                </div>
              </div>


                <div className="FeedPost-card-footer">
                    <div className='FeedPost-tag-container'>
                        <span className='FeedPost-card-tags'>Tags: </span>
                        {tags  ? (
                            tags.split(' ').map((tag, index) => (
                            <span key={index} className="FeedPost-card-hashtag">#{tag} </span>
                            ))
                        ) : (
                            <span className='FeedPost-card-hashtag'>None</span>
                        )}
                    </div>

                    <div className="FeedPost-card-actions">
                        <button className="like-button">
                            I Like this! <span className="like-count">{stars}</span> 
                            <img src={star_picture} alt="Star" className="star-icon" />
                        </button>

                        <button className="comment-button">
                            Comment <span className="comment-count">3</span> 
                            <img src={comment_picture} alt="Comment" className="comment-icon" />
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