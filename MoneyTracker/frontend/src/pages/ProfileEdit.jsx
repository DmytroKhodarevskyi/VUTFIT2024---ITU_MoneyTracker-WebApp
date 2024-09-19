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

    const [deletePhoto, setDeletePhoto] = useState(false);

    const [photoPreview, setPhotoPreview] = useState(null);

    

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


        async function mapGenderCode() {
            await fetchProfileData();
            await fetchGenderChoices();

            if (profileData && genderChoices.length > 0) {
                const genderLabel = profileData.gender;

                const matchingChoice = genderChoices.find(choice => choice.label === genderLabel);

                if (matchingChoice) {
                    setProfileData(prevData => ({
                        ...prevData,
                        gender: matchingChoice.value 
                    }));
                }
            }
        }

        mapGenderCode();
    }, [genderChoices.length]);

    const handleInputChange = (field, value) => {
        setProfileData((prevData) => ({
            ...prevData,
            [field]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setDeletePhoto(false);
            };
            reader.readAsDataURL(file);

            event.target.value = null;
        }
    }
    
    const handleUploadPhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleDeletePhoto = async () => {
        setPhotoPreview(null);
        setDeletePhoto(true);
    }

    const handleSave = async () => {
        try {

            if (deletePhoto) {
                await api.delete("/api/user/profile-photo/");
                setDeletePhoto(false); 
            }

            if (selectedFile) {
                const formData = new FormData();
                formData.append('profile_image', selectedFile);
                await api.post('/api/user/profile-photo/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSelectedFile(null);
            }  

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
                photoPreview={photoPreview}
                deletePhoto={deletePhoto}
            />
        </div>
    </MainContainer>
    )
}

export default ProfileEdit