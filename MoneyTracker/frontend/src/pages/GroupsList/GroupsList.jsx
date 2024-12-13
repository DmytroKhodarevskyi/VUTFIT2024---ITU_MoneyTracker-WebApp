/**
 * File: GroupList.jsx
 * Description: Page for viewing a list of groups.
 * Author: Dmytro Khodarevskyi
 * 
 * Notes:
 * - _
 */


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
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedGroups, setIsLoadedGroups] = useState(false);
  const [GroupsList, setGroupsList] = useState([]);

  const [SearchValue, setSearchValue] = useState("");
  const [subscribedOnly, setSubscribedOnly] = useState(false);

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
        const params = new URLSearchParams();

        if (SearchValue) {
          params.append("search", SearchValue);
        }

        if (subscribedOnly) {
          params.append("subscribed_only", "true");
        }

        const response = await api.get(`/api/groups/?${params.toString()}`);
        setGroupsList(response.data);
        setIsLoadedGroups(true);
      } catch (error) {
        console.error("Failed to fetch groups", error);
        setIsLoadedGroups(true);
      }
    };
    fetchGroups();
  }, [SearchValue, subscribedOnly]);

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
              <h2 className="GroupsList-description-title">
                Find something interesting
              </h2>
            </div>

            <div className="GroupsList-group-list-container">
              {isLoadedGroups ? ( 
                GroupsList.map((group) => (
                 

                  <GroupCard
                    id={group.id}
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
              className="GroupList-button-create"
              onClick={() => {
                nav("/create_group");
              }}
            >
              Create Group
            </button>

            <input
              className="GroupList-search-input"
              type="text"
              placeholder="Search..."
              value={SearchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />

            <div className="GroupList-subscribed-container">
              <label className="switch">
                <input
                  className="ReminderList-custom-checkbox"
                  type="checkbox"
                  id="subscribedOnly"
                  name="subscribedOnly"
                  value={subscribedOnly}
                  onChange={() => {
                    setSubscribedOnly(!subscribedOnly);
                  }}
                />
                <span className="slider round"></span>
              </label>

              <label htmlFor="subscribedOnly" className="GroupList-subscribedonly">Subscribed only</label>
            </div>
          </div>
        </div>
      </MainContainer>
    </>
  );
}

export default GroupsList;
