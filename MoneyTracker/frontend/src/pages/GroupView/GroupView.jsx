import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import TopPart from "../../components/TopPart/TopPart";
import MainContainer from "../../components/MainContainer/MainContainer";
import Users from "../../assets/Users.svg";
import Plus from "../../assets/PlusThreadIcon.svg";
import "./GroupView.css";

function GroupView() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [groupcreator, setGroupCreator] = useState(null);
  const [ismoderator, setIsModerator] = useState(false);

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
        const ismoderator = await api.get(
          `/api/groups/${GroupId}/checkcreator/`
        );
        setGroupCreator(creator.data);
        setIsModerator(ismoderator.data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch group data", error);
        setIsLoaded(true);
      }
    };

    fetchGroupData();
  }, [GroupId]);

  const handleSubscribe = async () => {
    // TODO: Implement subscription
  };

  const handleEdit = () => {
    nav(`/groups/${GroupId}/edit`);
  };

  const handleCreateThread = () => {
    nav(`/groups/${GroupId}/createthread`);
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
                    className="GroupView-subscribe-button">
                      Edit
                    </button>
                  ) : (
                    <button 
                    onClick={handleSubscribe}
                    className="GroupView-subscribe-button">
                      Subscribe
                    </button>
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
                      {GroupData.subscribers_count}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="GroupView-rightpart-container">
              {/* Table of mods */}

              {/* <table className="TransactionsList-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Curr.</th>
                  <th>Date</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <label style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          name="transaction"
                          value={transaction.name}
                          checked={selectedTransactions.includes(
                            transaction.id
                          )}
                          onChange={() => handleCheckboxChange(transaction)}
                        />
                        <span className="TransactionsList-checkbox"></span>
                        {transaction.title}
                      </label>
                    </td>
                    <td>
                      <span
                        style={{
                          color: transaction.incomeOrSpend ? "green" : "red",
                        }}
                      >
                        {transaction.incomeOrSpend ? "+" : "-"}{" "}
                        {transaction.amount}
                      </span>
                    </td>
                    <td>{getCurrencySymbol(transaction.currency)}</td>
                    <td>{formatDate(transaction.transaction_datetime)}</td>
                    <td>
                      <span
                        style={{
                          backgroundColor: transaction.categoryColor,
                          display: "inline-block",
                          width: "25px",
                          height: "25px",
                          borderRadius: "25%",
                        }}
                      ></span>
                      <span style={{ marginLeft: "8px" }}>
                        {transaction.categoryName || "Unknown category"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
            </div>
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
        </div>
      </MainContainer>
    </>
  );
}

export default GroupView;
