import { useState, useEffect } from "react"
import api from "../api"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import ProfileEditCard from "../components/ProfileEditCard"

function ProfileEdit() {

    const [profileData, setProfileData] = useState(null)

    const [isLoaded, setIsLoaded] = useState(false);

    const [error, setError] = useState(null);

    const [genderChoices, setGenderChoices] = useState([]);

    useEffect( () => {
        async function fetchProfileData() {
            try {
                const response = await api.get("/api/user/profile_detail/");  
                setProfileData(response.data);
                setIsLoaded(true);
            } catch (error) {
                window.alert("Failed to fetch profile dataa", error);
                setIsLoaded(false);
            }
        }
        fetchProfileData();


        async function fetchGenderChoices() {
            try {
                const response = await api.get("/api/gender-choices/");
                setGenderChoices(response.data)
            } catch (error) {
                console.error("Failed to fetch gender choices", error);
            }
        }
        fetchGenderChoices();
    }, []);

    const handleInputChange = (field, value) => {
        setProfileData((prevData) => ({
            ...prevData,
            [field]: value
        }));
    };

    
    const handleSave = async () => {
        try {
            const response = await api.patch("/api/user/profile_detail/", profileData);
            window.alert('Profile saved successfully!');
        } catch (error) {
            window.alert(error);
        }
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
        <TopPart nickname={profileData.username} selectedItem={"profile"}/>
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
                genderChoices={genderChoices}  
                handleInputChange={handleInputChange}
                handleSave={handleSave}
            />
        </div>
    </MainContainer>
    )
}

export default ProfileEdit