import { useState, useEffect } from "react"
import api from "../../api"
import MainContainer from "../../components/MainContainer/MainContainer"
import TopPart from "../../components/TopPart/TopPart";
import PublicationDetailCard from "../../components/PublicationDetailCard/PublicationDetailCard"
import { useParams } from 'react-router-dom';


function PublicationDetail () {

    const { publicationId } = useParams();
    const [publication, setPublication] = useState(null);
    const [profileData, setProfileData] = useState(null);

    const [isLiked, setIsLiked] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

    
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
                window.alert("Failed to fetch profile data", error);
                setIsLoaded(false);
            }
        }
        fetchData();
    }, []);



    if (!isLoaded) {
        return (
            <div className="loading-container">
                <h1 className="loading-text">Hold up, loading data...</h1>
            </div>
        )
      }

   
      return (
        <MainContainer>
        <TopPart nickname={profileData?.firstname} selectedItem={"profile"} profilePhoto={profilePhoto} />   
        <PublicationDetailCard
            publication={publication}
            profilePhoto={profilePhoto}
            fullname={profileData.fullname}
            mediaFiles={publication.media_files} 
            userId={userId}

        />     
        </MainContainer>
    );
 };

export default PublicationDetail;