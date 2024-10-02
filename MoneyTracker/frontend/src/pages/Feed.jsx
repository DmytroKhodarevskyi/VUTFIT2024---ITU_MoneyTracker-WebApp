import { useState, useEffect } from "react"
import api from "../api"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import { useNavigate } from 'react-router-dom'
import FeedPost from "../components/FeedPost"


function Feed () {

    const [profileData, setProfileData] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false);

    const [profilePhoto, setProfilePhoto] = useState(null);

    const [error, setError] = useState(null);

    const [displayedPosts, setDisplayedPosts] = useState([]);

    const [publications, setPublications] = useState([]); 

    // const navigate = useNavigate();

    useEffect(() => {
        const fetchNickname = async () => {
          try {
            
            const response = await api.get("/api/publications/feed/");
            setDisplayedPosts(response.data.slice(0, 3));

            const profileResponse = await api.get("/api/user/profile/");

            console.log("Publications: ", response.data);
            // setNickname(response.data.username);
            // setName(response.data.first_name);
            setProfilePhoto(profileResponse.data.profileImg);
            setIsLoaded(true); // Mark data as loaded
          } catch (error) {
            console.error("Failed to fetch nickname", error);
            setIsLoaded(true); // Even if there’s an error, consider data loaded to prevent infinite loading
          }
        };
    
        fetchNickname();
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
        <TopPart nickname={profileData?.firstname}
        selectedItem={"feed"} profilePhoto={profilePhoto}
        titletext={"Let’s see what’s going on!"} subtitletext={"Scroll through posts, gain popularity by commenting"}/>
        
        {displayedPosts.map((post) => (
            <FeedPost
                key={post.id}
                publication={post}
            />
        ))}

        </MainContainer>
    );
}

export default Feed;