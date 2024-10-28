import React from 'react';
import "./PublicationDetailCard.css";
import star_picture from "../../assets/star.svg";
import comment_picture from "../../assets/comment.svg";
import CommentPopUpCard from './CommentPopUpCard'; 
import { useState, useEffect } from "react"
import api from "../../api"

function PublicationDetailCard({
    publication,
    profileImg,
    fullname,
    mediaFiles,
    isLiked,
    userId,
}) {

    const [isModalOpen, setModalOpen] = useState(false);
    const [starsCount, setStars] = useState(publication.stars);
    const [commentaries, setCommentaries] = useState([])
    const [liked, setLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [loaded, setIsLoaded] = useState(false)

    const [isLikingComment, setIsLikingComment] = useState(false);


    const handleCommentAdded = (newComment) => {
        setCommentaries((prev) => [...prev, newComment]); 
    };
    
    useEffect(() => {
        async function fetchIsLiked() {
            setLoading(true); 
            try {
                const starResponse = await api.get(
                    `/api/publications/stars/user/${userId}/publication/${publication.id}/`
                );
                setLiked(starResponse.data.isLiked);
            } catch (error) {
                setIsLoaded(false);
            } finally {
                setLoading(false); 
            }
        }
        fetchIsLiked();
    }, []);

    useEffect(() => {
        async function fetchCommentariesWithAuthors() {
            setLoading(true);
            try {

                const commentaryResponse = await api.get(`/api/publications/${publication.id}/comments/`);
                const comments = commentaryResponse.data;

                const commentsWithAuthorData = await Promise.all(
                    comments.map(async (comment) => {
                        const authorProfileResponse = await api.get(`/api/user/profile/${comment.author}/`);
                        const authorProfile = authorProfileResponse.data;

                       
                        const likeResponse = await api.get(`/api/publications/stars/user/${userId}/comment/${comment.id}/`);
                        const isLiked = likeResponse.data.isLiked
    
                        return {
                            ...comment,
                            author: {
                                ...comment.author,
                                full_name: `${authorProfile.first_name} ${authorProfile.last_name}`,
                                profile_img: authorProfile.profileImg,
                            },
                            isLiked,
                        };
                    })
                );
    
                setCommentaries(commentsWithAuthorData);
            } catch (error) {
                console.error("Failed to fetch commentaries or author data:", error);
                setIsLoaded(false);
            } finally {
                setLoading(false);
            }
        }
    
        fetchCommentariesWithAuthors();
    }, [publication.id]);

    useEffect(() => {
        if (commentaries.length > 0) {
            setCommentaries((prevCommentaries) =>
                prevCommentaries.map((comment) => ({
                    ...comment,
                    isLiked: comment.isLiked,
                }))
            );
        }
    }, [commentaries]); 

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
            console.error("Error while liking/unliking the publication", error);
        } finally {
            setIsLiking(false); 
        }
    };

    const handleLikeCommentary = async (comment) => {
        if (isLikingComment) return;
    
        setIsLikingComment(true);
        try {

            if (comment.isLiked) {

                await api.delete(`/api/publications/comments/${comment.id}/unlike/`);
                comment.isLiked = false; 
                comment.stars = (comment.stars || 0) - 1; 
            } else {
 
                await api.post(`/api/publications/comments/${comment.id}/like/`);
                comment.isLiked = true; 
                comment.stars = (comment.stars || 0) + 1; 
            }
            setCommentaries((prevCommentaries) =>
                prevCommentaries.map((c) => (c.id === comment.id ? comment : c))
            );
        } catch (error) {
            console.error("Error while liking/unliking the comment", error);
        } finally {
            setIsLikingComment(false);
        }
    };


    const baseUrl = import.meta.env.VITE_API_URL;
    const fullImageUrl = profileImg ? `${baseUrl}${profileImg}` : `${baseUrl}media/profile_images/default.png`;

    return (
      <div className="publication-detail-card-container">
            <div className="publication-detail-info">
                <div className="publication-detail-header">
                    <img src={fullImageUrl} alt={`${fullname}'s profile`} className="publication-detail-header-image" draggable="false" />
                <div className="publication-detail-author">
                    <p className="publication-detail-fullname">{fullname}</p>
                </div>
            </div>
            <div className="publication-detail-content">
                    <div className="publication-detail-name">
                        {publication.title}
                    </div>
                    <p className="publication-detail-text-content">{publication.content_text}</p>

                    {mediaFiles && mediaFiles.length > 0 && (
                        <div className="publication-detail-media-container">
                            {mediaFiles.map((mediaItem, index) => (
                                <div key={index} className="publication-detail-media-item">
                                    {mediaItem.media_type === 'image' && (
                                        <img 
                                            src={mediaItem.file} 
                                            alt={`Publication image ${index}`} 
                                            className="publication-detail-media" 
                                        />
                                    )}
                                    {mediaItem.media_type === 'video' && (
                                        <video controls className="publication-detail-video">
                                            <source src={mediaItem.file} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                    {mediaItem.media_type === 'gif' && (
                                        <img 
                                            src={mediaItem.file} 
                                            alt={`Publication GIF ${index}`} 
                                            className="publication-detail-gif" 
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
 
                <div className="publication-detail-footer">
                    <div className='publication-detail-tag-container'>
                            <span className='publication-detail-tags'>Tags: </span>
                            {publication.tags  ? (
                                publication.tags.split(' ').map((tag, index) => (
                                <span key={index} className="publication-detail-hashtag">#{tag} </span>
                                ))
                            ) : (
                                <span className='publication-detail-hashtag'>None</span>
                            )}
                            </div>
                        </div>
                    <div className="publication-detail-actions">
                    <button onClick={handleLike} className="publication-detail-like-button">
                        <p>{liked ? "Unlike" : "I Like this!"}</p>
                            <span className="publication-detail-like-count">{starsCount}</span>
                            <img src={star_picture} alt="Star" className="publication-detail-star-icon" />
                    </button>
                    <button className="publication-detail-comment-button"  onClick={() => setModalOpen(true)}>
                        <span className="publication-detail-comment-text">Create Comment</span> 
                        <img src={comment_picture} alt="Comment" className="publication-detail-comment-icon" />
                    </button>
                        <CommentPopUpCard 
                            isOpen={isModalOpen} 
                            onClose={() => setModalOpen(false)} 
                            publicationId={publication.id} 
                            onCommentAdded={handleCommentAdded}
                        />
            
                    </div>
                </div>
            </div>
            <div className="publication-detail-commentary-section">
                {commentaries.length === 0 ? (
                    <div className="no-commentaries">
                        <p>No commentaries yet...</p>
  
                    </div>
                ) : (
                    commentaries.map((comment, index) => (
                        <div key={index} className="publication-detail-commentary-item">
                            <div className="publication-detail-commentary-header">
                                <img 
                                    src={comment.author.profile_img || defaultProfileImage} 
                                    alt={`${comment.author.full_name}'s profile`} 
                                    className="publication-detail-header-image" 
                                    draggable="false" 
                                />
                                <div className="publication-detail-author">
                                    <p className="publication-detail-fullname">{comment.author.full_name}</p>
                                </div>
                            </div>
                            <div className="publication-detail-comment-text">
                                <p>{comment.text}</p>
                            </div>
                            <button className="publication-detail-like-button"  onClick={() => handleLikeCommentary(comment)}>
                                <p>{comment.isLiked ? "Agreed!" : "I Agree!"}</p>
                                <span className="publication-detail-like-count">{comment.stars || 0}</span>
                                <img src={star_picture} alt="Star" className="publication-detail-star-icon" />
                            </button>
                            
                        </div>
                    ))
                )}
            </div>
      </div>
    );
  };

export default PublicationDetailCard;