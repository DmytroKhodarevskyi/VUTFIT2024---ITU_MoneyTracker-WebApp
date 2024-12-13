import { useState, useEffect } from "react"
import api from "../../api"
import MainContainer from "../../components/MainContainer/MainContainer"
import TopPart from "../../components/TopPart/TopPart";
import "./Profile.css"
import ProfileCard from '../../components/ProfileCards/ProfileCard'
import Notification from "../../components/Notifications/Notifications";



function Profile() {


    const [profileData, setProfileData] = useState(null)

    const [isLoaded, setIsLoaded] = useState(false);

    const [profilePhoto, setProfilePhoto] = useState(null)

    const [error, setError] = useState(null);

    const [notification, setNotification] = useState(null);
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
                
                setNotification({
                    message: "Failed to fetch profile data",
                    type: "success",
                  });
                setIsLoaded(false);
            }
        }
        fetchProfileData();
    }, []);

    const closeNotification = () => {
        setNotification(null); 
      };
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
        {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
        <TopPart nickname={profileData.firstname} selectedItem={"profile"} profilePhoto={profilePhoto}/>
            <ProfileCard 
                profileImg={profileData.profileImg}
                fullname={profileData.fullname}
                jobTitle={profileData.jobTitle}
                email={profileData.email}
                phone={profileData.phone}
                country={profileData.country}
                city={profileData.city}
                gender={profileData.gender}
                totalSpends={profileData.totalSpends}
                totalIncome={profileData.totalIncome}
                stars={profileData.starsCount}
            />
    </MainContainer>
    )
}

export default Profile