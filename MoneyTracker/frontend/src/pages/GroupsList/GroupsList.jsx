import React from "react";
import { useState, useEffect } from "react";
import TopPart from "../../components/TopPart/TopPart";
import MainContainer from "../../components/MainContainer/MainContainer";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import GroupCard from "./GroupCard";
import "./GroupsList.css";

function GroupsList() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedGroups, setIsLoadedGroups] = useState(false);
  const [GroupsList, setGroupsList] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await api.get("/api/user/profile/");
        setNickname(response.data.username);
        setProfilePhoto(response.data.profileImg);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch nickname", error);
        setIsLoaded(true);
      }
    };

    fetchNickname();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/api/groups/");
        setGroupsList(response.data);
        setIsLoadedGroups(true);
      } catch (error) {
        console.error("Failed to fetch groups", error);
        setIsLoadedGroups(true);
      }
    };
    fetchGroups();
  }, []);

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

        <div className="GroupsList-main-block-container">
          <div className="GroupsList-main-left-container">
            <div className="GroupsList-left-title-container">
                <h1 className="GroupsList-main-title">Groups</h1>
                <h2 className="GroupsList-description-title">Find something interesting</h2>
            </div>

            <div className="GroupsList-group-list-container">
                {isLoadedGroups ? ( // If groups are loaded

                GroupsList.map((group) => (
                    // <div
                    //   key={group.id}
                    //   className="GroupList-group-container"
                    //   onClick={() => {
                    //     nav(`/group/${group.id}`);
                    //   }}
                    // >
                    //   <div className="GroupList-group-name">{group.name}</div>
                    //   <div className="GroupList-group-description">
                    //     {group.description}
                    //   </div>
                    // </div>

                    <GroupCard
                        key={group.id}
                        name={group.name}
                        subscribers={group.subscribers_count}
                        image={group.group_image}
                        onClick={() => {
                            nav(`/group/${group.id}`);
                        }}
                    />
                ))
                ) : (
                <div>LOADING GROUPS...</div>
                )}
            </div>
          </div>
          <div className="GroupList-main-right-container">
            <button
              onClick={() => {
                nav("/create_group");
              }}
            >
              Create Group
            </button>
          </div>
        </div>
      </MainContainer>
    </>
  );
}

export default GroupsList;
