import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import TopPart from "../../components/TopPart/TopPart";
import MainContainer from "../../components/MainContainer/MainContainer";
import NewThreadPopup from "./NewThreadPopup";
import ThreadRoot from "./ThreadRoot";
import Users from "../../assets/Users.svg";
import Plus from "../../assets/PlusThreadIcon.svg";
import "./GroupView.css";

function GroupView() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [groupcreator, setGroupCreator] = useState(null);
  const [ismoderator, setIsModerator] = useState(false);



  const [moderators, setModerators] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshThreads, setRefreshThreads] = useState(false);

  const [GroupData, setGroupData] = useState(null);
  const [baseurl, setBaseUrl] = useState(null);
  const [GroupId, setGroupId] = useState(null);

  const [newThreadPopup, setNewThreadPopup] = useState(false);

  const [threads, setThreads] = useState([]);

  const [IsSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  const handleSubscribe = async () => {
    try {
      await api.post(`/api/groups/${GroupId}/subscribe/`);
      console.log("Subscribed successfully");
      setSubscribersCount(subscribersCount + 1);
      setIsSubscribed(true);
    } catch (error) {
      console.error("Failed to subscribe", error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await api.delete(`/api/groups/${GroupId}/unsubscribe/`);
      console.log("Unsubscribed successfully");
      setSubscribersCount(subscribersCount - 1);
      setIsSubscribed(false);
    } catch (error) {
      console.error("Failed to unsubscribe", error);
    }
  };

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await api.get("/api/user/profile/");
        setNickname(response.data.username);
        setProfilePhoto(response.data.profileImg);
        // setIsLoaded(true);

        setGroupId(window.location.pathname.split("/")[2]);
      } catch (error) {
        console.error("Failed to fetch nickname", error);
        // setIsLoaded(true);
      }
    };

    fetchNickname();
  }, []);

  useEffect(() => {
    if (!GroupId) {
      return;
    }

    const fetchGroupData = async () => {
      try {
        const response = await api.get(`/api/groups/${GroupId}/viewdata/`);
        const subscribed = await api.get(
          `/api/groups/${GroupId}/checksubscription/`
        );
        console.log("Subscribed: ", subscribed.data.is_subscribed);
        setIsSubscribed(subscribed.data.is_subscribed);

        console.log("Group Data: ", response.data.group);
        console.log("Base Url: ", response.data.base_url);

        // i want url like "http://localhost:8000/media/group_images/2022/07/01/1.jpg"
        setGroupData(response.data.group);
        setSubscribersCount(response.data.group.subscribers_count);
        setBaseUrl(response.data.base_url);

        const creator = await api.get(`/api/groups/${GroupId}/getcreator/`);
        const ismoderator = await api.get(
          `/api/groups/${GroupId}/checkcreator/`
        );
        setGroupCreator(creator.data);
        setIsModerator(ismoderator.data);


        const moderatorsResponse = await api.get(`/api/groups/${GroupId}/moderators/`);
        console.log("Moderators: ", moderatorsResponse.data.moderators);
        setModerators(moderatorsResponse.data.moderators);  

        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch group data", error);
        setIsLoaded(true);
      }
    };

    fetchGroupData();
  }, [GroupId]);

  useEffect(() => {
    if (!GroupId || !isLoaded) {
      return;
    }

    console.log("Fetching threads for group: ", GroupId);

    const fetchThreads = async () => {
      try {
        const response = await api.get(`/api/groups/${GroupId}/threads/`);
        console.log("Threads: ", response.data);
        setThreads(response.data);
      } catch (error) {
        console.error("Failed to fetch threads", error);
      }
    };

    fetchThreads();
  }, [isLoaded, refreshThreads]);

  const SubscribeButton = () => {
    if (IsSubscribed) {
      return (
        <button
          onClick={handleUnsubscribe}
          className="GroupView-subscribe-button"
        >
          Unsubscribe
        </button>
      );
    } else {
      return (
        <button
          onClick={handleSubscribe}
          className="GroupView-subscribe-button"
        >
          Subscribe
        </button>
      );
    }
  };

  const handleEdit = () => {
    nav(`/groups/${GroupId}/edit`);
  };

  const handleCreateThread = () => {
    // nav(`/groups/${GroupId}/createthread`);
    setNewThreadPopup(!newThreadPopup);
  };

  const handleNewThreadPopup = () => {
    setNewThreadPopup(!newThreadPopup);
  };

  //   console.log("Group ID: ", GroupId);
  if (!isLoaded) {
    return (
      <>
        <MainContainer>LOADING...</MainContainer>
      </>
    );
  }




  return (
    <>
      <MainContainer>
        <TopPart
          nickname={nickname}
          profilePhoto={profilePhoto}
          selectedItem={"groups"}
          titletext={"Conversation starting point"}
          subtitletext={"Let’s see if there is something to discuss"}
        />

        <div className="GroupView-main-container">
          <div className="GroupView-header-container">
            <div
              style={{
                backgroundImage: `url(${baseurl + GroupData.group_image})`,
              }}
              className="GroupView-img-container"
            />
            <div className="GroupView-middlepart-container">
              <div className="GroupView-titletext-container">
                <h1 className="GroupView-group-title">{GroupData.name}</h1>
                <div className="GroupView-description-container">
                  <h2 className="GroupView-group-description">
                    {GroupData.description}
                  </h2>
                </div>
              </div>

              <div className="GroupView-middlepart-bottom-container">
                <div className="GroupView-creator-container">
                  <div
                    style={{
                      backgroundImage: `url(${
                        baseurl + groupcreator.profile_picture
                      })`,
                    }}
                    className="GroupView-creator-picture"
                  />
                  <h2 className="GroupView-creator-name">
                    {groupcreator.creator}
                  </h2>
                </div>

                <div className="GroupView-buttonscontainer">
                  {ismoderator.is_creator || ismoderator.is_moderator ? (
                    <button
                      onClick={handleEdit}
                      className="GroupView-subscribe-button"
                    >
                      Edit
                    </button>
                  ) : (
                    // <button
                    //   onClick={handleSubscribe}
                    //   className="GroupView-subscribe-button"
                    // >
                    //   Subscribe
                    // </button>

                    <SubscribeButton />
                  )}

                  <div className="GroupView-subscribers-container">
                    <div className="GroupView-icon-subscribers-title-container">
                      <img
                        className="GroupView-subscribers-icon"
                        src={Users}
                        alt=""
                      />
                      <h1 className="GroupView-subscribers-title">
                        Subscribers
                      </h1>
                    </div>
                    <p className="GroupView-subscribers-count">
                      {/* {GroupData.subscribers_count} */}
                      {subscribersCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isLoaded ? (
          <table className="group-moderators-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Profile Image</th>
              </tr>
            </thead>
            <tbody>
              {moderators.map((moderator) => (
                
                <tr key={moderator.id}>
                  <td>{`${moderator.first_name} ${moderator.last_name}`}</td>
                  <td>{moderator.username}</td>
                  <td>
                    {moderator.profile.profile_image ? (
                      <img
                        src={moderator.profile.profile_image}
                        alt={`${moderator.username}'s profile`}
                        className="moderator-profile-img"
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading moderators...</p>
        )}
      </div>

          {ismoderator.is_creator || ismoderator.is_moderator ? (
            <div
              onClick={handleCreateThread}
              className="GroupView-create-new-thread-container"
            >
              <h1 className="GroupView-create-new-thread-text">
                Create new thread
              </h1>
              <img
                className="GroupView-create-new-thread-icon"
                src={Plus}
                alt=""
              />
            </div>
          ) : null}

          <div className="GroupView-threads-container">
            {threads.map((thread) => (
              <ThreadRoot
                admin={ismoderator.is_creator || ismoderator.is_moderator}
                key={thread.id}
                thread={thread}
                baseurl={baseurl}
                id={thread.id}
                setRefreshThreads={() => setRefreshThreads((prev) => !prev)}
              />
            ))}
          </div>
        </div>

        {newThreadPopup ? (
          <NewThreadPopup
            setNewThreadPopup={setNewThreadPopup}
            groupId={GroupId}
            setLoaded={setIsLoaded}
            setRefreshThreads={() => setRefreshThreads((prev) => !prev)}
          />
        ) : null}
      </MainContainer>
    </>
  );
}

export default GroupView;
