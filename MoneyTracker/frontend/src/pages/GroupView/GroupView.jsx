import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import TopPart from "../../components/TopPart/TopPart";
import MainContainer from "../../components/MainContainer/MainContainer";
import Users from "../../assets/Users.svg";
import "./GroupView.css";

function GroupView() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [groupcreator, setGroupCreator] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const [GroupData, setGroupData] = useState(null);
  const [baseurl, setBaseUrl] = useState(null);
  const [GroupId, setGroupId] = useState(null);

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

        console.log("Group Data: ", response.data.group);
        console.log("Base Url: ", response.data.base_url);

        // i want url like "http://localhost:8000/media/group_images/2022/07/01/1.jpg"
        const imgurl = setGroupData(response.data.group);
        setBaseUrl(response.data.base_url);

        const creator = await api.get(`/api/groups/${GroupId}/getcreator/`);
        setGroupCreator(creator.data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch group data", error);
        setIsLoaded(true);
      }
    };

    fetchGroupData();
  }, [GroupId]);

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
                  <button className="GroupView-subscribe-button">
                    Subscribe
                  </button>

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
                      {GroupData.subscribers_count}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="GroupView-rightpart-container">
              {/* Table of mods */}
            </div>
          </div>
        </div>
      </MainContainer>
    </>
  );
}

export default GroupView;