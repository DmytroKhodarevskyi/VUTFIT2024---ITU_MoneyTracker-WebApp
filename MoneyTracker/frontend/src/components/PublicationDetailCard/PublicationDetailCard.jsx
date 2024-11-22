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
    publicationProfilePhoto,
}) {
    console.log(userId)
    const [isModalOpen, setModalOpen] = useState(false);
    const [starsCount, setStars] = useState(publication.stars);
    const [commentaries, setCommentaries] = useState([])
    const [liked, setLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [loaded, setIsLoaded] = useState(false)
   
    const [isLikingComment, setIsLikingComment] = useState(false);


 
    
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
                    const isLiked = likeResponse.data.isLiked;

                    return {
                        ...comment,
                        author: {
                            ...comment.author,
                            full_name: `${authorProfile.first_name} ${authorProfile.last_name}`,
                            profile_img: authorProfile.profileImg,
                            id: authorProfile.id,
                        },
                        isLiked,
                    };
                })
            );

            setCommentaries(commentsWithAuthorData);
        } catch (error) {
            console.error("Failed to fetch commentaries or author data:", error);
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        fetchCommentariesWithAuthors(); 
    }, [publication.id]);

    const handleCommentAdded = (newComment) => {
        setCommentaries((prev) => [...prev, newComment]);
        fetchCommentariesWithAuthors(); 
    };


    useEffect(() => {
        if (commentaries.length > 0) {
            setCommentaries((prevCommentaries) =>
                prevCommentaries.map((comment) => ({
                    ...comment,
                    isLiked: comment.isLiked,
                }))
            );
        }
    }, []); 

    useEffect(() => {
        setStars(publication.stars);
        setLiked(isLiked);
    }, [publication, isLiked]);
    
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

    const handleLikeCommentary = async (comment) => {
        if (isLikingComment) return;
    
        setIsLikingComment(true);
        try {
            let updatedComment = { ...comment }; 

            if (comment.isLiked) {

                await api.delete(`/api/publications/comments/${comment.id}/unlike/`);
                updatedComment.isLiked = false;
                updatedComment.stars_count -= 1; 
           
               
            } else {
 
                await api.post(`/api/publications/comments/${comment.id}/like/`);
                updatedComment.isLiked = true;
                updatedComment.stars_count += 1;
                
            }
            setCommentaries((prevCommentaries) =>
                    prevCommentaries.map((c) =>
                        c.id === comment.id ? updatedComment : c
                    )
                );
        } catch (error) {
            if (error.response?.data?.error_code === "self_like") {
                alert("You cannot like your own comment.");
            }
        } finally {
            setIsLikingComment(false);
        }
    };

    const handleDeleteCommentary = async (comment) => {
      
        const isConfirmed = window.confirm("Are you sure you want to delete this comment?");

       if (isConfirmed) {
        try {
            await api.delete(`/api/publications/${publication.id}/comments/${comment}/delete/`);
            
            setCommentaries((prevCommentaries) => 
                prevCommentaries.filter((c) => c.id !== comment)
            );
        } catch (error) {
            console.error("Error while deleting commentary", error);
        }
    }
};

    

   
    const baseUrl = import.meta.env.VITE_API_URL;

    return (
      <div className="publication-detail-card-container">
            <div className="publication-detail-info">
                <div className="publication-detail-header">
                    <img src={publicationProfilePhoto || `${baseUrl}media/profile_images/default.png`} alt={`${publication.author.first_name + " " + publication.author.last_name}'s profile`} className="publication-detail-header-image" draggable="false" />
                <div className="publication-detail-author">
                    <p className="publication-detail-fullname">{publication.author.first_name + " " + publication.author.last_name}</p>
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
                                    src={comment.author.profile_img} 
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
                            <div className="publication-detail-button-section">
                            <button className="publication-detail-comment-like-button"  onClick={() => handleLikeCommentary(comment)}>
                                <p>{comment.isLiked ? "Agreed!" : "I Agree!"}</p>
                                <span className="publication-detail-comment-like-count">{comment.stars_count}</span>
                                <img src={star_picture} alt="Star" className="publication-detail-star-icon" />
                            </button>
                            {(publication.author.id === userId || comment.author.id === userId) && (
                            <button className="publication-detail-delete-button"    onClick={() => handleDeleteCommentary(comment.id)} >
                                Delete
                            </button>
                        )}
                            </div>
                        </div>
                    ))
                )}
            </div>
      </div>
    );
  };

export default PublicationDetailCard;