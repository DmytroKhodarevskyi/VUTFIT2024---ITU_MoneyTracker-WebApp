import { useState, useRef, useEffect } from "react"
import api from "../api"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import ProfileEditCard from "../components/ProfileEditCard"
import { useNavigate } from 'react-router-dom';

function ProfileEdit() {

    const [profileData, setProfileData] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false);

    const [error, setError] = useState(null);

    const [genderChoices, setGenderChoices] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const fileInputRef = useRef(null);

    const navigate = useNavigate(); 

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

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }
    
    const handleUploadPhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileSelect = async () => {
        if(!selectedFile) {
            window.alert("Select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append('profile_image', selectedFile)

        try {
            setIsLoaded(true); 
            await api.post('/api/user/profile-photo/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

        const response = await api.get("/api/user/profile_detail/");
        setProfileData(response.data)
        } catch (error) {
            window.alert("Failed to upload photo", error)
        } finally {
            setIsLoaded(false);
        }
    };

    const handleDeletePhoto = async () => {

        try {
            await api.delete("api/user/profile-photo/");

            const response = await api.get("/api/user/profile_detail");
            setProfileData(response.data);
        } catch (error) {
            window.alert("Failed to delete photo", error)
        }
    }

    const handleSave = async () => {
        try {
            const response = await api.patch("/api/user/profile_detail/", profileData);
            navigate('/profile');
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
                fileInputRef={fileInputRef}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleFileChange={handleFileChange}
                handleFileSelect={handleFileSelect}
                handleUploadPhoto={handleUploadPhoto}
                handleDeletePhoto={handleDeletePhoto}
            />
        </div>
    </MainContainer>
    )
}

export default ProfileEdit