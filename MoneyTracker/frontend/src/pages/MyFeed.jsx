import { useState, useEffect } from "react"
import api from "../api"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import MyFeedCard from "../components/MyFeedCard"
import { useNavigate } from 'react-router-dom'


function MyFeed () {

    const [profileData, setProfileData] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false);

    const [profilePhoto, setProfilePhoto] = useState(null);

    const [error, setError] = useState(null);

    const [publications, setPublications] = useState([]); 

    const navigate = useNavigate();

    const handleNewPost = () => {
        navigate('/create-post'); 
    };

    const handleEditPost = () => {
        navigate('/create-post'); 
    };

    const handleDeletePost = async (publicationId) => {
        try {
            await api.delete(`/api/publications/${publicationId}/delete/`);
            setPublications(publications.filter(publication => publication.id !== publicationId));
        } catch (error) {
            console.error("failed to delete publication:", error)
        }
    }

    
    useEffect( () => {
        async function fetchProfileData() {
            try {
                const [response, photoResponse, publicationsResponse] = 
                await Promise.all([
                    api.get("/api/user/profile_detail/"),
                    api.get("/api/user/profile/"),
                    api.get("/api/publications/my/") 
                ])
                setProfileData(response.data);
                setProfilePhoto(photoResponse.data.profileImg)
                setPublications(publicationsResponse.data);
                setIsLoaded(true);

                console.log("Publications:: ", publicationsResponse.data);

            } catch (error) {
                window.alert("Failed to fetch profile data", error);
                setIsLoaded(false);
            }
        }
        fetchProfileData();
    }, []);


    if (error) {
        return (
            <div className="error-container">
                <h1 className="error-text">Failed to load profile data</h1>
                <p>Details: {error.message}</p>
                <p>Please check the console for more information.</p>
            </div>
        );
    }


    if (!isLoaded) {
        return (
            <div className="loading-container">
                <h1 className="loading-text">Hold up, loading data...</h1>
            </div>
        )
      }

      console.log(publications)

      return (
        <MainContainer>
        <TopPart nickname={profileData?.firstname} selectedItem={"profile"} profilePhoto={profilePhoto} />        
        <div className="feed-container">
            {publications && publications.length > 0 ? (
                publications.map((publication, index) => {
                    if (publication) {
                        return (
                            <MyFeedCard
                                key={index}
                                profileImg={profileData.profileImg}
                                fullname={profileData.fullname}
                                publication={publication}
                                mediaFiles={publication.media_files}
                                handleNewPost={handleNewPost}
                                handleEditPost={handleEditPost}
                                handleDeletePost={handleDeletePost}
                            />
                        );
                    } else {
                        return (
                            <div key={index} className="end-message">
                                <p>End of publications</p>
                            </div>
                        );
                    }
                })
            ) : (
                <div className="no-publications-message">
                    <p>None of the publications were published</p>
                </div>
            )}
        </div>
    </MainContainer>
    );
}

export default MyFeed;