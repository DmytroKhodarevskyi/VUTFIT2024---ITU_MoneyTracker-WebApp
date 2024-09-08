import { useState, useEffect } from "react"
import api from "../api"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import ProfileEditCard from "../components/ProfileEditCard"

function ProfileEdit() {

    const [profileData, setProfileData] = useState(null)

    const [isLoaded, setIsLoaded] = useState(false);

    const [error, setError] = useState(null);

    useEffect( () => {
        async function fetchProfileData() {
            try {
                const response = await api.get("/api/user/profile_detail/");  
                setProfileData(response.data);
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

    console.log('ProfileEdit component rendered');


    return (
        <MainContainer>
        <TopPart nickname={profileData.username} />
        <div className="profile-container">
            <ProfileEditCard 
                profileImg={profileData.profileImg}
                firstname={profileData.firstname}
                lastname={profileData.lastname}
                fullname={profileData.fullname}
                jobTitle={profileData.jobTitle} 
                email={profileData.email}
                phone={profileData.phone}
                country={profileData.country}
                city={profileData.city}
                gender={profileData.gender}
            />
        </div>
    </MainContainer>
    )
}

export default ProfileEdit