import { useState, useEffect } from "react"
import api from "../api"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import { useNavigate } from 'react-router-dom'
import FeedPost from "../components/FeedPost"
import "../styles/FeedPost.css"


function Feed () {

    const [profileData, setProfileData] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false);

    const [profilePhoto, setProfilePhoto] = useState(null);

    const [error, setError] = useState(null);

    const [displayedPosts, setDisplayedPosts] = useState([]);

    const [publications, setPublications] = useState([]); 

    const [currentIndex, setCurrentIndex] = useState(0); // Track the current index

    const [CenterIdx, setCenterIdx] = useState(1); // Track the center index

    // const navigate = useNavigate();


    useEffect(() => {
        const fetchNickname = async () => {
          try {
            
            const response = await api.get("/api/publications/feed/");
            setPublications(response.data);
            setDisplayedPosts(response.data.slice(0, 3));

            // setCenterIdx(Math.floor(displayedPosts.length / 2));
            // console.log("CenterIdx: ", CenterIdx);

            const profileResponse = await api.get("/api/user/profile/");

            // console.log("Publications: ", response.data);
            console.log(publications.length);
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

      const handleNext = () => {
        if (currentIndex + 3 < publications.length) {
            setCurrentIndex(currentIndex + 1);
            setDisplayedPosts(publications.slice(currentIndex + 1, currentIndex + 4));
            setCenterIdx(1);
        } else if (currentIndex + 3 === publications.length) {
            setCurrentIndex(currentIndex + 1);
            setDisplayedPosts(publications.slice(currentIndex + 1));
            setCenterIdx(2);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setDisplayedPosts(publications.slice(currentIndex - 1, currentIndex + 2));
            setCenterIdx(1);
        } else if (currentIndex === 0) {
            setDisplayedPosts(publications.slice(0, 2));
            setCenterIdx(0);
        }
    };

    if (!isLoaded) {
        return (
            <div className="loading-container">
                <h1 className="loading-text">Hold up, loading data...</h1>
            </div>
        )
      }

    // const CenterIdx = Math.floor(displayedPosts.length / 2);

      return (
        // <MainContainer>
        // <TopPart nickname={profileData?.firstname}
        // selectedItem={"feed"} profilePhoto={profilePhoto}
        // titletext={"Let’s see what’s going on!"} subtitletext={"Scroll through posts, gain popularity by commenting"}/>
        
        // {displayedPosts.map((post) => (
        //     <FeedPost
        //         key={post.id}
        //         publication={post}
        //     />
        // ))}

        // </MainContainer>

        <MainContainer>
            <TopPart
                nickname={profileData?.firstname}
                selectedItem={"feed"}
                profilePhoto={profilePhoto}
                titletext={"Let’s see what’s going on!"}
                subtitletext={"Scroll through posts, gain popularity by commenting"}
            />

            <div className="feed-wrapper">
              <button 
              onClick={handlePrevious} 
              disabled={currentIndex === -1}
              >
                Previous
              </button>
              {console.log("centerIdx: ", CenterIdx)}
                {displayedPosts.map((post, index) => (


                    <FeedPost
                        key={post.id}
                        publication={post}
                        IsCenter={index === CenterIdx}                 // Check if the post is center
                        IsLeft={index === CenterIdx - 1}               // Check if the post is left of center
                        IsRight={index === CenterIdx + 1} 
                        shouldDisplay={currentIndex >= 0 && currentIndex < publications.length} // Pass a prop to indicate if the post should be displayed             // Check if the post is right of center
                        // className={index === Math.floor(displayedPosts.length / 2) ? "feed-post center" : "feed-post side"}
                    />
                ))}
                <button 
                onClick={handleNext}
                disabled={currentIndex + 3 > publications.length}
                >
                  Next
                </button>
            </div>
        </MainContainer>
    );
}

export default Feed;