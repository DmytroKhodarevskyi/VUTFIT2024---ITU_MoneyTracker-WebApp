import { useState, useEffect } from "react";
import api from "../api";
import MainContainer from "../components/MainContainer";
import TopPart from "../components/TopPart";
//import "../styles/Profile.css"; // Ensure this has the necessary styles
import "../styles/CategoriesAndStatistics.css"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Assuming recharts is correctly installed

function CategoriesAndStatistics() {
    const [categories, setCategories] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#888888"];

    useEffect(() => {
        async function fetchData() {
            try {
                const [categoriesResponse, profileResponse] = await Promise.all([
                    api.get("/api/user/categories-statistics/"),  // Assuming this endpoint exists
                    api.get("/api/user/profile/"),  // Profile endpoint
                ]);
                setCategories(categoriesResponse.data);
                setProfileData(profileResponse.data);
                setProfilePhoto(profileResponse.data.profileImg); // Assuming `profileImg` is part of the profile response

                setIsLoaded(true);
                
            } catch (error) {
                window.alert("Failed to fetch categories and statistics", error);
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
            <TopPart nickname={profileData.first_name} selectedItem={"update"} profilePhoto={profilePhoto} />
            <div className="category-container">
            <div className="content-container">
                {/* Categories Section */}
                <div className="categories-section">
                    <h2>Categories</h2>
                    <table className="categories-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Color</th>
                                <th>Creation Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories && categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.name}</td>
                                    <td>
                                        <span
                                            style={{
                                                backgroundColor: category.color,
                                                display: "inline-block",
                                                width: "15px",
                                                height: "15px",
                                                borderRadius: "50%",
                                            }}
                                        ></span>
                                    </td>
                                    <td>{new Date(category.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                
            </div>
        </div>     
        </MainContainer>
    );
}

export default CategoriesAndStatistics;

