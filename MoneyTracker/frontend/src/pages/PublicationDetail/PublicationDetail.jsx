/**
 * File: PublicationDetail.jsx
 * Description: Page for viewing publication detail (from feed).
 * Author: Denys Chernenko
 * 
 * Notes:
 * - _
 */


import { useState, useEffect } from "react"
import api from "../../api"
import MainContainer from "../../components/MainContainer/MainContainer"
import TopPart from "../../components/TopPart/TopPart";
import PublicationDetailCard from "../../components/PublicationDetailCard/PublicationDetailCard"
import { useParams } from 'react-router-dom';
import Notification from "../../components/Notifications/Notifications";


function PublicationDetail () {

    const { publicationId } = useParams();
    const [publication, setPublication] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [publicationProfilePhoto, setPublicationProfilePhoto] = useState(null);

    const [isLiked, setIsLiked] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    
    useEffect(() => {
        async function fetchData() {
            try {

                const [response, photoResponse, publicationResponse] = await Promise.all([
                    api.get("/api/user/profile_detail/"),
                    api.get("/api/user/profile/"),
                    api.get(`/api/publications/${publicationId}/`),
                  
                ]);
    
                setProfileData(response.data);
                setProfilePhoto(photoResponse.data.profileImg);
                setUserId(photoResponse.data.id);
                setPublication(publicationResponse.data);
                setIsLoaded(true);
                    
            } catch (error) {
                
                setNotification({
                    message: "Failed to feeeetch profile data",
                    type: "success",
                  });
                setIsLoaded(false);
            }
        }
        fetchData();
    }, []);

    const closeNotification = () => {
        setNotification(null); 
      };
    useEffect(() =>  {
        async function fetchProfilePublciationPhoto() {
            try {
                const response = await api.get(`/api/user/profile/${publication.author.id}/`);
                setPublicationProfilePhoto(response.data.profileImg);
                setIsLoaded(true);
            } catch {
                setIsLoaded(false);
            }
        }
        fetchProfilePublciationPhoto();
        
    }, [publication])

    if (!isLoaded) {
        return (
            <div className="loading-container">
                <h1 className="loading-text">Hold up, loading data...</h1>
            </div>
        )
      }

      return (
        <MainContainer>
            {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
        <TopPart nickname={profileData?.firstname} selectedItem={"feed"} profilePhoto={profilePhoto} />   
        <PublicationDetailCard
            publication={publication}
            profilePhoto={profilePhoto}
            fullname={profileData.fullname}
            mediaFiles={publication.media_files} 
            userId={userId}
            publicationProfilePhoto={publicationProfilePhoto}
        />     
        </MainContainer>
    );
 };

export default PublicationDetail;