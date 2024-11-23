import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import "./Admin.css";

const EditUser = () => {
  const { pk } = useParams();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    gender: "N",
    job: "Unemployed",
    stars_count: 0,
  });
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/api/custom_admin/user/${pk}/data/`);
        const userData = response.data;

        setFormData({
          first_name: userData.firstname || "",
          last_name: userData.lastname || "",
          email: userData.email || "",
          phone: userData.phone || "",
          country: userData.country || "",
          city: userData.city || "",
          gender: userData.gender || "N",
          job: userData.jobTitle || "Unemployed",
          stars_count:userData.starsCount || 0,
        });
        console.log(userData);
        const usernameResponse = await api.get(
          `/api/custom_admin/users/${pk}/username/`
        );
        setUsername(usernameResponse.data.username);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        alert("Failed to load user data. Please try again.");
      }
    };

    fetchUserData();
  }, [pk]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSave = async (e) => {
    e.preventDefault();

   
    const nameRegex = /^[A-Za-z]+$/;
    const jobTitleRegex = /^[A-Za-z][A-Za-z0-9\s]*$/;
    const countryCityRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[1-9][0-9]{7,14}$/;

    if (!nameRegex.test(formData.first_name.trim())) {
        alert("First name can only contain letters.");
        return;
    }
    if (!nameRegex.test(formData.last_name.trim())) {
        alert("Last name can only contain letters.");
        return;
    }
    if (!jobTitleRegex.test(formData.job.trim())) {
        alert("Job can only contain letters, spaces, and numbers (but not starting with a number).");
        return;
    }
    if (!countryCityRegex.test(formData.country.trim()) && formData.country) {
        alert("Country can only contain letters and spaces.");
        return;
    }
    if (!countryCityRegex.test(formData.city.trim()) && formData.city) {
        alert("City can only contain letters and spaces.");
        return;
    }
    if (!emailRegex.test(formData.email.trim())) {
        alert("Invalid email format.");
        return;
    }
    if (!phoneRegex.test(formData.phone.trim()) && formData.phone) {
        alert("Phone must start with + or a non-zero digit and be 8 to 15 digits long.");
        return;
    }

    
    const payload = {
        firstname: formData.first_name.trim(),
        lastname: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        gender: formData.gender,
        jobTitle: formData.job.trim() || "Unemployed",
        starsCount: formData.stars_count, 
    };

    setLoading(true);

    try {
        await api.patch(`/api/custom_admin/user/${pk}/edit/`, payload);
        alert("User updated successfully!");
        navigate("/custom-admin");
    } catch (error) {
        console.error("Error updating user:", error.response || error.message);
        alert(
            `Error: ${
                error.response?.data?.detail || "An error occurred while updating the user."
            }`
        );
    } finally {
        setLoading(false);
    }
};


  if (!isLoaded) {
    return <h1 className="loading-text">Loading user data...</h1>;
  }

  return (
    <form onSubmit={handleSave} className="admin-main">
      <h1 className="admin-header">Edit User {username}</h1>

      <div className="admin-input-container">
        <input
          type="text"
          name="first_name"
          placeholder="First Name*"
          value={formData.first_name}
          onChange={handleInputChange}
          
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name*"
          value={formData.last_name}
          onChange={handleInputChange}
          
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email*"
          value={formData.email}
          onChange={handleInputChange}
          
          required
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
          className="form-select"
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
          type="number"
          name="stars_count"
          placeholder="stars_count"
          value={formData.stars_count}
          onChange={(e) => handleInputChange(e)}
          
        />
      </div>

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditUser;
