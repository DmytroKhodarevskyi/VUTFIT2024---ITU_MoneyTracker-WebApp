/**
 * File: CreateNewUser.jsx
 * Description: A page for creating a new user. It allows input for user details such as username, name, email, phone, address, gender, job, and password. Validates the inputs before submission to the backend.
 * Author: Rostyslav Kachan
 * 
 * Notes:
 * -
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Notification from "../../components/Notifications/Notifications";

const CreateNewUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    repeatPassword: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    gender: "N", 
    job: "Unemployed",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null); 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const closeNotification = () => {
    setNotification(null); 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.username === "") {
      
      setNotification({
        message: "Username cant be empty",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (formData.first_name === "") {
      
      setNotification({
        message: "First Name cant be empty",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (formData.last_name === "") {
      
      setNotification({
        message: "Last Name cant be empty",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (formData.password === "") {
      
      setNotification({
        message: "Passwords cant be empty",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (formData.email === "") {
      
      setNotification({
        message: "Email cant be empty",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (formData.password !== formData.repeatPassword) {
      
      setNotification({
        message: "Passwords do not match",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (formData.phone == "") {
      
      setNotification({
        message: "Phone cant be empty",
        type: "error",
      });
      setLoading(false);
      return;
    }
    
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(formData.first_name.trim())) {
      
      setNotification({
        message: "First name can only contain letters.",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (!nameRegex.test(formData.last_name.trim())) {
      
      setNotification({
        message: "Last name can only contain letters.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    
    const phoneRegex = /^[+]?[1-9][0-9]{7,14}$/;
    if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
      
      setNotification({
        message: "Phone number must start with + or a non-zero digit and must be 8 to 15 digits long.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    
    const payload = {
      username: formData.username,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      profile: {
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        gender: formData.gender,
        job: formData.job.trim(),
      },
    };

    try {
      
      const res = await api.post("/api/user/register/", payload);
      
      setNotification({
        message: "User created successfully!",
        type: "success",
      });
      setTimeout(() => {
      navigate("/custom-admin");},2000);
    } catch (error) {
      console.error("Error creating user:", error.response || error.message);
      const errorMessage =error.response?.data?.detail || "An error occurred while creating the user.";
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className = "admin-main">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <h1 className="admin-header">Create New User</h1>

      <div className="admin-input-container">
  <input
    type="text"
    name="username"
    placeholder="Username*"
    value={formData.username}
    onChange={handleInputChange}
    
  />
  <input
    type="text"
    name="first_name"
    placeholder="First Name*"
    value={formData.first_name}
    onChange={handleInputChange}
    
  />
  <input
    type="text"
    name="last_name"
    placeholder="Last Name*"
    value={formData.last_name}
    onChange={handleInputChange}
    
  />
  <input
    type="email"
    name="email"
    placeholder="Email*"
    value={formData.email}
    onChange={handleInputChange}
    
  />
  <input
    type="tel"
    name="phone"
    placeholder="Phone Number"
    value={formData.phone}
    onChange={handleInputChange}
  />
  <input
    type="text"
    name="country"
    placeholder="Country"
    value={formData.country}
    onChange={handleInputChange}
  />
  <input
    type="text"
    name="city"
    placeholder="City"
    value={formData.city}
    onChange={handleInputChange}
  />
  <label className="admin-user-label" htmlFor="gender">
    Select Gender
  </label>
  <select
    name="gender"
    id="gender"
    value={formData.gender}
    onChange={handleInputChange}
  >
    <option value="N">Not Specified</option>
    <option value="M">Male</option>
    <option value="F">Female</option>
  </select>
  <input
    type="text"
    name="job"
    placeholder="Job"
    value={formData.job}
    onChange={handleInputChange}
  />
  <input
    type="password"
    name="password"
    placeholder="Password*"
    value={formData.password}
    onChange={handleInputChange}
    
  />
  <input
    type="password"
    name="repeatPassword"
    placeholder="Repeat Password*"
    value={formData.repeatPassword}
    onChange={handleInputChange}
    
  />
</div>

<button type="submit" className="form-button" disabled={loading}>
  {loading ? "Creating..." : "Create User"}
</button>

    </form>
  );
};

export default CreateNewUser;
