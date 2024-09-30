import { useState, useEffect } from "react";
import api from "../api";
import MainContainer from "../components/MainContainer";
import TopPart from "../components/TopPart";
import "../styles/CategoriesAndStatistics.css";

const staticCategories = [
  { id: 1, name: "Groceries", color: "green", created_at: "2024-09-21" },
  { id: 2, name: "Direct Payment", color: "navy", created_at: "" },
  { id: 3, name: "Medical", color: "red", created_at: "" },
  { id: 4, name: "Entertainment", color: "cyan", created_at: "" },
  { id: 5, name: "Name", color: "green", created_at: "" },
  { id: 6, name: "Name", color: "green", created_at: "" },
  { id: 7, name: "Utilities", color: "yellow", created_at: "2024-10-01" }
];

function CategoriesAndStatistics() {
  const [categories, setCategories] = useState(staticCategories); // Use static categories initially
  const [profileData, setProfileData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const profileResponse = await api.get("/api/user/profile/"); // Only profile, since categories are static
        setProfileData(profileResponse.data);
        setProfilePhoto(profileResponse.data.profileImg); // Assuming `profileImg` is part of the profile response

        setIsLoaded(true);
      } catch (error) {
        window.alert("Failed to fetch profile", error);
        setError(error);
        setIsLoaded(false);
      }
    }
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <h1 className="error-text">Failed to load data</h1>
        <p>Details: {error.message}</p>
        <p>Please check the console for more information.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <h1 className="loading-text">Hold up, loading data...</h1>
      </div>
    );
  }

  return (
    <MainContainer>
      <TopPart
        nickname={profileData.first_name}
        selectedItem={"update"}
        profilePhoto={profilePhoto}
      />
      <div className="category-container">
        <div className="content-container">
          {/* Categories Section */}
          <div className="categories-section">
            <div className="text-block">
            <h2 className="category-text-h2">Categories</h2>
            <p className="category-subtext">List of your categories</p>
            </div>
            <div className="table-block">
            <table className="categories-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Color</th>
      <th>Creation Date</th>
    </tr>
  </thead>
  <tbody>
    {categories.map((category) => (
      <tr key={category.id}>
        <td>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input type="radio" name="category" value={category.name} />
            <span className="custom-radio"></span>
            {category.name}
          </label>
        </td>
        <td>
          <span
            style={{
              backgroundColor: category.color,
              display: 'inline-block',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
            }}
          ></span>
        </td>
        <td>
          {category.created_at
            ? new Date(category.created_at).toLocaleDateString('en-GB').replace(/\//g, '.')
            : 'Date'}
        </td>
      </tr>
    ))}
  </tbody>
</table>


            </div>
            <div className="delete-section">
              <p className="delete-text">Delete Selected</p>
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}

export default CategoriesAndStatistics;
