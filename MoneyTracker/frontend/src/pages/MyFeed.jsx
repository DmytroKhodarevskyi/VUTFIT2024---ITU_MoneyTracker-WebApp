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

    const navigate = useNavigate();

    const handleNewPost = () => {
        navigate('/create-post'); 
    };


    useEffect( () => {
        async function fetchProfileData() {
            try {
                const [response, photoResponse] = 
                await Promise.all([
                    api.get("/api/user/profile_detail/"),
                    api.get("/api/user/profile/")
                ])
                setProfileData(response.data);
                setProfilePhoto(photoResponse.data.profileImg)
                setIsLoaded(true);
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


    return (
        <MainContainer>
            <TopPart nickname={profileData.firstname} selectedItem={"profile"} profilePhoto={profilePhoto}/>
                <div>
                    <button className="add-post-button" onClick={handleNewPost}>Add new post</button>
                 </div>
                <MyFeedCard 
                 profileImg={profileData.profileImg}
                 fullname={profileData.fullname}
                 />
        </MainContainer>
        )
}


export default MyFeed;