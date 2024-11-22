import React from "react";
import "./ProfileCard.css";
import Arrow from "../../assets/ArrowRight.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Star from "../../assets/star.svg";
import api from "../../api";

function ProfileCard({
  profileImg,
  fullname,
  jobTitle,
  email,
  phone,
  country,
  city,
  gender,
  totalSpends,
  totalIncome,
  stars,
}) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const fullImageUrl = profileImg
    ? `${baseUrl}${profileImg}`
    : `${baseUrl}media/profile_images/default.png`;

  const [formattedStars, setFormattedStars] = useState("");

  const [selectedReminder, setSelectedReminder] = useState(null);
  const [reminderList, setReminderList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const formatStars = (num) => {
      if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + "M";
      } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + "K";
      } else {
        return num.toString();
      }
    };

    setFormattedStars(formatStars(stars));
  }, [stars]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await api.get("/api/reminders/reminders/upcoming/");
        setReminderList(response.data);

        if (response.data.length > 0) {
          setSelectedReminder(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch reminders", error);
      }
    };
    fetchReminders();
  }, []);

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

        setSelectedReminders(oldReminders.data);

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

    clearOldReminders();
  }, []);

  const handleNextReminder = () => {
    const currentIndex = reminderList.indexOf(selectedReminder);
    if (currentIndex === reminderList.length - 1) {
      setSelectedReminder(reminderList[0]);
    } else {
      setSelectedReminder(reminderList[currentIndex + 1]);
    }
  };

  const handleChangeProfile = () => {
    navigate("/edit-profile");
  };

  const handleMyPublicationsButton = () => {
    navigate("/my-feed");
  };

  const ReminderContent = () => {
    return (
      <>
        <div className="reminder-info">
          <p className="label-reminder">Reminder</p>

          <div className="reminder-text-deadline-amount">
            <p className="text-reminder">
              There will be{" "}
              <span className="text-teal">{selectedReminder.title}</span> soon,
              don`t forget to pay for it!
            </p>

            <div className="reminder-row">
              <div className="reminder-item">
                <p className="label-deadline">Deadline:</p>
                <p className="deadline-reminder">
                  {" "}
                  {formatDate(selectedReminder.deadline)}
                </p>
              </div>

              <div className="reminder-item">
                <p className="label-amount">Amount:</p>
                <p className="amount-reminder"> ${selectedReminder.amount}</p>
              </div>
            </div>
          </div>
        </div>

        <img src={Arrow} className="arrow-btn" draggable="false" onClick={handleNextReminder}/>
      </>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image">
            <img
              src={fullImageUrl}
              alt={`${fullname}'s profile`}
              className="profile-image"
              draggable="false"
            />
            <div className="ProfileCard-stars-container">
              <h2 className="ProfileCard-stars-amount">{formattedStars}</h2>
              <img
                src={Star}
                className="ProfileCard-star-img"
                draggable="false"
              />
            </div>
          </div>
          <div className="profile-header-info">
            <div className="profile-details">
              <h2 className="profile-name">{fullname}</h2>
              <p className="profile-job-title">{jobTitle}</p>
            </div>
            {/* <div className="profile-contact-info"> */}
            <div className="profile-form">
              <p className="label-contacts">Email</p>
              <div className="profile-box">
                <p>{email}</p>
              </div>
            </div>

            <div className="profile-form">
              <p className="label-contacts">Phone</p>
              <div className="profile-box">
                <p>{phone}</p>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>

        <div className="personal-container">
          <h3 className="personal-info-header">Personal Info</h3>
          <div className="profile-personal-info">
            <div className="profile-item">
              <p className="label-personal-info">Country</p>
              <div className="profile-box">
                <p>{country}</p>
              </div>
            </div>
            <div className="profile-item">
              <p className="label-personal-info">City</p>
              <div className="profile-box">
                <p>{city}</p>
              </div>
            </div>
            <div className="profile-item">
              <p className="label-personal-info">Gender</p>
              <div className="profile-box">
                <p>{gender}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-financial-info">
          <div className="profile-item-financial">
            <p className="label-financial">Total Spends</p>
            <div className="profile-box">
              <p>{totalSpends}</p>
            </div>
          </div>
          <div className="profile-item-financial">
            <p className="label-financial">Total Income</p>
            <div className="profile-box">
              <p>{totalIncome}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-sidebar">
        <div className="profile-sidebar-buttons">
          <button
            className="change-profile-button"
            onClick={handleChangeProfile}
          >
            {" "}
            Change Profile
          </button>
          <button
            className="setup-reminder-button"
            onClick={handleMyPublicationsButton}
          >
            {" "}
            My Publications
          </button>
          <button
            className="setup-reminder-button"
            onClick={() => {
              navigate("reminders/");
            }}
          >
            {" "}
            Setup Reminders
          </button>
        </div>

        <div className="profile-sidebar-bottom">
          <div className="profile-currency">
            <label htmlFor="currency" className="label-currency">
              Currency
            </label>
            <select id="currency" name="currency" className="currency-select">
              <option value="usd">USD - United States Dollar</option>
            </select>
          </div>

          <div className="profile-reminder">
            {reminderList.length > 0 ? (
              <ReminderContent />
            ) : (
              <p className="label-reminder">
                There are no upcoming reminders, you are all set!
              </p>
            )}

            {/* <div className='reminder-info'>
                                <p className="label-reminder">Reminder</p>

                                    <div className="reminder-text-deadline-amount">
                                        <p className="text-reminder">
                                            There will be <span className="text-teal">*Some Taxes*</span> soon, don`t forget to pay for it!
                                        </p>

                                        <div className="reminder-row">
                                            <div className="reminder-item">
                                                <p className="label-deadline">Deadline:</p>
                                                <p className='deadline-reminder'> *Some Deadline*</p>
                                            </div>

                                            <div className="reminder-item">
                                                    <p className="label-amount">Amount:</p>
                                                    <p className='amount-reminder'> {selectedReminder.amount}</p>
                                            </div>
                                        </div>
                                    </div>
                            </div>

                            <img src={Arrow} className='arrow-btn' draggable="false"/> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
