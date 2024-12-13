/**
 * File: Feed.jsx
 * Description: Page for viewing user publications in feed.
 * Author: Dmytro Khodarevskyi
 * 
 * Notes:
 * - _
 */


import { useState, useEffect } from "react";
import api from "../../api"
import MainContainer from "../../components/MainContainer/MainContainer";
import TopPart from "../../components/TopPart/TopPart";
import { useNavigate } from "react-router-dom";

import { NavigationContext } from "../../components/FeedPost/NavigationContext";
import FeedPost from "../../components/FeedPost/FeedPost";
import "./Feed.css";

function Feed() {
  const [profileData, setProfileData] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [error, setError] = useState(null);

  const [displayedPosts, setDisplayedPosts] = useState([]);

  const [publicationWithoutLikes, setPublicationWithoutLikes] = useState([])

  const [publications, setPublications] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0); 

  const navigate = useNavigate();

  const handleComment = (publicationId) => {
    navigate(`/publication_detail/${publicationId}`);
  };


  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await api.get("/api/publications/feed/");
        const profileResponse = await api.get("/api/user/profile/");
        console.log(profileResponse.data.id)
        
        const publicationWithLikes = await Promise.all(response.data.map(async (pub) => {
          const starResponse = await api.get(`/api/publications/stars/user/${profileResponse.data.id}/publication/${pub.id}/`);
          

          console.log(starResponse.data)
          return {
            ...pub,
            isLiked: starResponse.data.isLiked 
          };
        }));
        
        setPublications(publicationWithLikes);
        setDisplayedPosts(publicationWithLikes.slice(0, 2)); 
        setProfilePhoto(profileResponse.data.profileImg);
        setIsLoaded(true); 
      } catch (error) {
        console.error("Failed to fetch nickname", error);
        setIsLoaded(true); 
      }
    };

    fetchNickname();
  }, []);

  const handleNext = () => {
    

    if (currentIndex === 0) {
      
      setDisplayedPosts(publications.slice(currentIndex, currentIndex + 3));
      setCurrentIndex(currentIndex + 1);
      return;
    }

    const maxIndex = publications.length - 3; 
    console.log("Max Index: ", maxIndex);

    if (currentIndex <= maxIndex) {
      setCurrentIndex(currentIndex + 1);
      setDisplayedPosts(publications.slice(currentIndex, currentIndex + 3));
    } else {
      
      setCurrentIndex(currentIndex + 1);
      setDisplayedPosts(publications.slice(currentIndex, currentIndex + 2));
    }
  };

  const handlePrevious = () => {
    if (publications.length === 2) {
      console.log("Publications length is 2");
      setCurrentIndex(currentIndex - 1);
      setDisplayedPosts(publications.slice(currentIndex - 1, currentIndex + 2));
      return;
    }

    if (currentIndex === publications.length - 1) {
      setCurrentIndex(currentIndex - 1);
      setDisplayedPosts(publications.slice(currentIndex - 2, currentIndex + 2));
      return;
    }

    if (currentIndex === 1) {
      setCurrentIndex(currentIndex - 1);
      setDisplayedPosts(publications.slice(currentIndex - 1, currentIndex + 1));
      return;
    }

    if (currentIndex < publications.length - 1) {
      setCurrentIndex(currentIndex - 1);
      setDisplayedPosts(publications.slice(currentIndex - 2, currentIndex + 1));
    }
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
          handleComment={handleComment}
        />
      );
    }

    if (displayedPosts.length === 2 && currentIndex === 0) {
      console.log("Current Index on render: ", currentIndex);
      

      return (
        <>
          <FeedPost
            key={displayedPosts[0].id}
            publication={displayedPosts[0]}
            IsCenter={true}
            IsLeft={false}
            IsRight={false}
            shouldDisplay={true}
            handleComment={handleComment}
          />
          <FeedPost
            key={displayedPosts[1].id}
            publication={displayedPosts[1]}
            IsCenter={false}
            IsLeft={false}
            IsRight={true}
            shouldDisplay={true}
            handleComment={handleComment}
          />
        </>
      );
    }

    if (displayedPosts.length === 2 && currentIndex + 3 > publications.length) {
      
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
            handleComment={handleComment}

            
          />
          
          <FeedPost
            key={displayedPosts[1].id}
            publication={displayedPosts[1]}
            IsCenter={true}
            IsLeft={false}
            IsRight={false}
            shouldDisplay={true}
            handleComment={handleComment}
          />
        </>
      );
    } else {
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
            handleComment={handleComment}
          />
          <FeedPost
            key={displayedPosts[1].id}
            publication={displayedPosts[1]}
            IsCenter={true}
            IsLeft={false}
            IsRight={false}
            shouldDisplay={true}
            handleComment={handleComment}
          />
          <FeedPost
            key={displayedPosts[2].id}
            publication={displayedPosts[2]}
            IsCenter={false}
            IsLeft={false}
            IsRight={true}
            shouldDisplay={true}
            handleComment={handleComment}
          />
        </>
      );
    }
  };

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
          

          {RenderPosts()}

          
        </div>
      </MainContainer>
    </NavigationContext.Provider>
  );
}

export default Feed;
