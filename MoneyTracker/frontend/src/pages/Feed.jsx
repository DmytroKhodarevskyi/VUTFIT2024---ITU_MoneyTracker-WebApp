import { useState, useEffect } from "react"
import api from "../api"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import { useNavigate } from 'react-router-dom'

import { NavigationContext } from "../components/NavigationContext"
import FeedPost from "../components/FeedPost"
import "../styles/FeedPost.css"


function Feed () {

    const [profileData, setProfileData] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false);

    const [profilePhoto, setProfilePhoto] = useState(null);

    const [error, setError] = useState(null);

    const [displayedPosts, setDisplayedPosts] = useState([]);

    const [publications, setPublications] = useState([]); 

    const [currentIndex, setCurrentIndex] = useState(1); // Track the current index

    // const navigate = useNavigate();


    useEffect(() => {
        const fetchNickname = async () => {
          try {
            
            const response = await api.get("/api/publications/feed/");
            setPublications(response.data);
            setDisplayedPosts(response.data.slice(0, 3));

            console.log("STARTING INDEX: ", currentIndex);

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

    //   const handleNext = () => {

    //     console.log("Current Index: ", currentIndex);
        
    //     if (currentIndex === 0) {
    //         console.log("CURRRENT INDEEEEEEEEEEEEX: ", currentIndex);
    //         setDisplayedPosts(publications.slice(0, 3));
    //         setCurrentIndex(currentIndex + 1);
    //         return;
    //     }

    //     if (currentIndex + 3 < publications.length) {
    //         setCurrentIndex(currentIndex + 1);
    //         setDisplayedPosts(publications.slice(currentIndex + 1, currentIndex + 4));
    //         setCenterIdx(1);
    //     } else if (currentIndex + 3 === publications.length) {
    //         setCurrentIndex(currentIndex + 1);
    //         setDisplayedPosts(publications.slice(currentIndex + 1));
    //         setCenterIdx(2);
    //     }
    // };

  //   const handleNext = () => {
  //     console.log("Current Index: ", currentIndex);
  
  //     if (currentIndex + 3 < publications.length) {
  //         setCurrentIndex(currentIndex + 1);
  //         setDisplayedPosts(publications.slice(currentIndex + 1, currentIndex + 4));
  //     } else if (currentIndex + 3 === publications.length) {
  //         // Rightmost edge case, only show remaining posts
  //         setCurrentIndex(currentIndex + 1);
  //         setDisplayedPosts(publications.slice(currentIndex + 1));
  //     }
  // };

  const handleNext = () => {
    console.log("Current Index: ", currentIndex);
    const maxIndex = publications.length - 3; // The last valid slice start index

    if (currentIndex === 0) {
      // When starting from the first 3 posts
      setDisplayedPosts(publications.slice(0, 3));
      setCurrentIndex(currentIndex + 1);
      return;
    }
    
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
      setDisplayedPosts(publications.slice(currentIndex + 1, currentIndex + 4));
    } else if (currentIndex === maxIndex) {
      // When reaching the last 3 posts
      setCurrentIndex(currentIndex + 1);
      setDisplayedPosts(publications.slice(currentIndex + 1));
    }
  };

    // const handlePrevious = () => {

    //     console.log("Current Index: ", currentIndex);

    //     if (currentIndex > 0) {
    //         setCurrentIndex(currentIndex - 1);
    //         setDisplayedPosts(publications.slice(currentIndex - 1, currentIndex + 2));
    //         setCenterIdx(1);
    //     } else if (currentIndex === 0) {
    //         console.log("leftmost on previous");
    //         setDisplayedPosts(publications.slice(0, 2));
    //         setCenterIdx(0);
    //     }
    // };

  //   const handlePrevious = () => {
  //     console.log("Current Index: ", currentIndex);
  
  //     // Ensure we don't go below the first post (index 0)
  //     if (currentIndex > 0) {
  //         setCurrentIndex(currentIndex - 1);
  
  //         if (currentIndex - 1 === 0) {
  //             // When we reach the leftmost point, ensure we display only 2 posts
  //             setDisplayedPosts(publications.slice(0, 2));
  //         } else {
  //             // Otherwise, move one post to the left and display the correct slice
  //             setDisplayedPosts(publications.slice(currentIndex - 1, currentIndex + 2));
  //         }
  
  //     } else if (currentIndex === 0) {
  //         // Handle the case where we're already at the leftmost edge
  //         console.log("Leftmost on previous, can't go back further.");
  //     }
  // };

  const handlePrevious = () => {
  
    // Prevent skipping by going exactly 1 step backward
    if (currentIndex > 0) {

      // console.log("Current Index before prev: ", currentIndex);
      setCurrentIndex(currentIndex - 1);
  
      if (currentIndex - 1 === 0) {
        // Handle leftmost edge (show first two posts)
        setDisplayedPosts(publications.slice(0, 2));
      } else {
        // Move backward by one post
        setDisplayedPosts(publications.slice(currentIndex - 1, currentIndex + 2));
      }
    } else if (currentIndex === -1) {
      // Already at the leftmost edge
      console.log("Leftmost, can't go further.");
    }

    // console.log("Current Index after prev: ", currentIndex);

  };


    const RenderPosts = () => {
      if (displayedPosts.length === 0) {
        return (
          <div className="loading-container">
            <h1 className="loading-text">No posts to display</h1>
          </div>
        );  
      }

      if (displayedPosts.length === 1) {
        return (
            <FeedPost
              key={displayedPosts[0].id}
              publication={displayedPosts[0]}
              IsCenter={true}
              IsLeft={false}
              IsRight={false}
              shouldDisplay={true}
            />
        );
      }

      if (displayedPosts.length === 2 && currentIndex === 0) {

        console.log("Current Index on render: ", currentIndex);
        // console.log("LEFTMOST TRIGGERED, displayedPosts: ", displayedPosts);

        return (
          <>
            <FeedPost
              key={displayedPosts[0].id}
              publication={displayedPosts[0]}
              IsCenter={true}
              IsLeft={false}
              IsRight={false}
              shouldDisplay={true}
            />
            <FeedPost
              key={displayedPosts[1].id}
              publication={displayedPosts[1]}
              IsCenter={false}
              IsLeft={false}
              IsRight={true}
              shouldDisplay={true}
            />
          </>

        );
      }

      if (displayedPosts.length === 2 && currentIndex + 3 > publications.length) {

        // console.log("RIGHTMOST TRIGGERED displayedPosts: ", displayedPosts);
        console.log("Current Index on render: ", currentIndex);


        return (
          <>
            {/* <div className="FeedPost-postwrap"
              onClick={handlePrevious}
            > */}
            <FeedPost
              key={displayedPosts[0].id}
              publication={displayedPosts[0]}
              IsCenter={false}
              IsLeft={true}
              IsRight={false}
              shouldDisplay={true}

              // onClick={handlePrevious()}
            />
            {/* </div> */}
            <FeedPost
              key={displayedPosts[1].id}
              publication={displayedPosts[1]}
              IsCenter={true}
              IsLeft={false}
              IsRight={false}
              shouldDisplay={true}
            />
          </>

        );
      }

      else {

        console.log("Current Index on render: ", currentIndex);

        return (
          <>
            <FeedPost
              key={displayedPosts[0].id}
              publication={displayedPosts[0]}
              IsCenter={false}
              IsLeft={true}
              IsRight={false}
              shouldDisplay={true}

            />
            <FeedPost
              key={displayedPosts[1].id}
              publication={displayedPosts[1]}
              IsCenter={true}
              IsLeft={false}
              IsRight={false}
              shouldDisplay={true}
            />
            <FeedPost
              key={displayedPosts[2].id}
              publication={displayedPosts[2]}
              IsCenter={false}
              IsLeft={false}
              IsRight={true}
              shouldDisplay={true}

            />
          </>
        );
      }
    }

      return (
        <NavigationContext.Provider value={{ handleNext, handlePrevious }}>

        <MainContainer>
            <TopPart
                nickname={profileData?.firstname}
                selectedItem={"feed"}
                profilePhoto={profilePhoto}
                titletext={"Let’s see what’s going on!"}
                subtitletext={"Scroll through posts, gain popularity by commenting"}
            />

            <div className="feed-wrapper">
              {/* <button 
              onClick={handlePrevious} 
              disabled={currentIndex === -1}
              >
              Previous
              </button> */}


              {RenderPosts()}

              {/* <button 
              onClick={handleNext}
              disabled={currentIndex + 3 > publications.length}
              >
                Next
              </button> */}
            </div>
        </MainContainer>
        </NavigationContext.Provider>

    );
}

export default Feed;