import React from "react";
import api from "../../api";
import MainContainer from "../../components/MainContainer/MainContainer";
import TopPart from "../../components/TopPart/TopPart";
import { useState, useEffect } from "react";
import CreateReminderPopup from "./CreateReminderPopup";
import "./ReminderList.css";

function ReminderList() {
  const [nickname, setNickname] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [remindersList, setRemindersList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("uk-UA")} ${date.toLocaleTimeString(
      "uk-UA",
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  }

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await api.get("/api/user/profile/");
        setNickname(response.data.first_name);
        setProfilePhoto(response.data.profileImg);

        const remindersResponse = await api.get("/api/reminders/reminders/");

        setRemindersList(remindersResponse.data);
        // setRemindersList([
        //   {
        //     id: 1,
        //     title: "Buy milk",
        //     deadline: Date.now(),
        //     amount: 100,
        //   },
        //   {
        //     id: 2,
        //     title: "Buy bread",
        //     deadline: Date.now(),
        //     amount: 300,
        //   },
        //   {
        //     id: 3,
        //     title: "Buy cheese",
        //     deadline: Date.now(),
        //     amount: 200,
        //   },
        // ]);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    }
    fetchProfileData();
  }, []);

  return (
    <>
      <MainContainer>
        <TopPart
          nickname={nickname}
          selectedItem={"profile"}
          profilePhoto={profilePhoto}
        />
        <div className="ReminderList-main-container">
          <div className="ReminderList-left-part">
            <h1>Reminders</h1>
            <h2>Set up your notifiers</h2>

            <div className="ReminderList-reminders-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Deadline</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {remindersList.map((reminder) => (
                    <tr key={reminder.id}>
                      {/* <td>
                        <label
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type="checkbox"
                            name="category"
                            value={category.name}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCheckboxChange(category)}
                          />
                          <span className="CategoriesAndStatistics-custom-checkbox"></span>
                          <p className="CategoriesAndStatistics-categories-names">
                            {category.name}
                          </p>
                        </label>
                      </td> */}
                      <td>{reminder.title}</td>
                      <td>{formatDate(reminder.deadline)}</td>
                      <td>{reminder.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="ReminderList-right-part">
            <button onClick={() => setShowPopup(true)}>Create Reminder</button>
          </div>
        </div>

      <CreateReminderPopup
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        setRemindersList={setRemindersList}
      />
      </MainContainer>
    </>
  );
}

export default ReminderList;
