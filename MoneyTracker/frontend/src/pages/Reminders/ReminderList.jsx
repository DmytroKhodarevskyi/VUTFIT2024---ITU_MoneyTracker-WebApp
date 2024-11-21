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

  const [selectedReminders, setSelectedReminders] = useState([]);

  const handleCheckboxChange = (reminder) => {
    if (selectedReminders.includes(reminder.id)) {
      setSelectedReminders(
        selectedReminders.filter((id) => id !== reminder.id)
      );
    } else {
      setSelectedReminders([...selectedReminders, reminder.id]);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete("/api/reminders/batchdelete/", {
        data: {
          reminders_ids: selectedReminders,
        },
      });

      console.log(response.data);
      setRemindersList(
        remindersList.filter((reminder) => !selectedReminders.includes(reminder.id))
      )
      setSelectedReminders([]);

    } catch (error) {
      console.error("Failed to delete reminders", error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("uk-UA")} ${date.toLocaleTimeString(
      "uk-UA",
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  }

  useEffect(() => {
    async function clearOldReminders() {
      try {
        const oldReminders = await api.get("/api/reminders/reminders/old/");
        if (oldReminders.data.length === 0) {
          return;
        }

        console.log("Old reminders: ");
        console.log(oldReminders.data);
        setSelectedReminders(oldReminders.data);
        console.log(selectedReminders);

        const response = await api.delete("/api/reminders/batchdelete/", {
          data: {
            reminders_ids: selectedReminders,
          },
        });

        setSelectedReminders([]);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to clear old reminders", error);
      }
    }

    // clearOldReminders();
  }, [remindersList]);

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
            <div className="RemindersList-title-container">
              <h1 className="RemindersList-title">Reminders</h1>
              <h2 className="RemindersList-subtitle">Set up your notifiers</h2>
            </div>

            <div className="RemindersList-table-block">
              <table className="ReminderList-reminders-table">
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
                      <td>
                        <label
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            className="ReminderList-custom-checkbox-input"
                            type="checkbox"
                            name="reminder"
                            value={reminder.title}
                            checked={selectedReminders.includes(reminder.id)}
                            onChange={() => handleCheckboxChange(reminder)}
                          />
                          <span className="ReminderList-custom-checkbox"></span>
                          <p className="RemindersList-reminders-names">
                            {reminder.title}
                          </p>
                        </label>
                      </td>
                      {/* <td>{reminder.title}</td> */}
                      <td>{formatDate(reminder.deadline)}</td>
                      <td>{reminder.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="CategoriesAndStatistics-bottom-part">
              <p>
                {selectedReminders.length} row(s) of {remindersList.length}{" "}
                selected.
              </p>
              <div className="CategoriesAndStatistics-delete-text">
                <button
                  className="CategoriesAndStatistics-delete-text"
                  onClick={handleDelete}
                >
                  Delete Selected
                </button>
              </div>
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
