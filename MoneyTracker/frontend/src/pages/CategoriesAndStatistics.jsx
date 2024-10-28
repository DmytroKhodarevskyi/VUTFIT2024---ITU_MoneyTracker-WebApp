import React, { useState, useEffect } from "react";
import api from "../api";
import MainContainer from "../components/MainContainer";
import TopPart from "../components/TopPart";
import "../styles/CategoriesAndStatistics.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];



const topCategories = [
  { name: 'Direct Payment', value: 3456.56, color: 'navy' },
  { name: 'Groceries', value: 580.56, color: 'green' },
  { name: 'Medical', value: 340.22, color: 'red' },
  { name: 'Entertainment', value: 86.05, color: 'cyan' },
  { name: 'Croissants', value: 2.00, color: 'yellow' }
];


function CategoriesAndStatistics() {
  const [categories, setCategories] = useState([]); 
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [profileData, setProfileData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesListResponce = await api.get("/api/categories/"); 
        const profileResponse = await api.get("/api/user/profile/"); 
        setProfileData(profileResponse.data);
        setProfilePhoto(profileResponse.data.profileImg);
        setCategories(categoriesListResponce.data); 
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

  const handleCheckboxChange = (category) => {
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== category.id)
      );
    } else {
      setSelectedCategories([...selectedCategories, category.id]);
    }
  };

  const handleDelete = async () => {
    if (selectedCategories.length === 0) {
        alert('Please select at least one category to delete.');
        return;
    }

    try {
        
   
        await Promise.all(
            selectedCategories.map(async (categoryId) => {
                console.log(categoryId);
                await api.delete(`/api/categories/${categoryId}/delete/`);
            })
        );

        
        setCategories(categories.filter((category) => !selectedCategories.includes(category.id)));

        
        setSelectedCategories([]);
    } catch (error) {
        console.error('There was an error deleting the categories:', error);
        alert('Failed to delete the selected categories. Please try again.');
      }
  };

  return (
    <MainContainer>
      <TopPart
        nickname={profileData.first_name}
        selectedItem={"update"}
        profilePhoto={profilePhoto}
      />
      <div className="CategoriesAndStatistics-category-container">
        <div className="CategoriesAndStatistics-left-container">
          <div className="CategoriesAndStatistics-categories-section">
            
              <h2 className="CategoriesAndStatistics-category-text-h2">Categories</h2>
              <p className="CategoriesAndStatistics-category-subtext">List of your categories</p>
            
            <div className="CategoriesAndStatistics-table-block">
              <table className="CategoriesAndStatistics-categories-table">
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
                          <input 
                            type="checkbox" 
                            name="category" 
                            value={category.name} 
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCheckboxChange(category)} 
                          />
                          <span className="CategoriesAndStatistics-custom-checkbox"></span>
                          <p className="CategoriesAndStatistics-categories-names">{category.name}</p>
                        </label>
                      </td>
                      <td>
                        <span
                          style={{
                            backgroundColor: category.color,
                            display: 'inline-block',
                            width: '25px',
                            height: '25px',
                            borderRadius: '25%',
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
            <div className="CategoriesAndStatistics-bottom-part">
              <p>{selectedCategories.length} row(s) of {categories.length} selected.</p>
              <div className="CategoriesAndStatistics-delete-text">
                <button className="CategoriesAndStatistics-delete-text" onClick={handleDelete}>Delete Selected</button>
              </div>
            </div>
          </div>
        </div>
        <div className="CategoriesAndStatistics-right-container">
          <div className="CategoriesAndStatistics-right-text-block">
          <h2 className="CategoriesAndStatistics-category-text-h2">Statistics</h2>
          <p className="CategoriesAndStatistics-category-subtext">Categories chart</p>
          </div>
          <div className="CategoriesAndStatistics-right-top-categories">
            <p>Top 5 categories of all time</p>
          </div>
          <div className="CategoriesAndStatistics-right-list-of-categories">
          <div className="category-row">
  {topCategories.slice(0, 3).map((category, index) => (
    <div key={index} className="category-item">
      <div className="category-label">
        <span
          style={{
            display: 'inline-block',
            width: '7px',
            height: '57px',
            backgroundColor: category.color,
            marginRight: '16px',
          }}
        ></span>
        <div style={{ display: 'inline-block' }}>
          <span>{index + 4}. {category.name}</span>
          <div className="category-value">
            <span>
              ${Math.floor(category.value)}
            </span>
            <span style={{ color: "#00000080" }}>
              .
              {(category.value % 1).toFixed(2).split('.')[1]}
            </span>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
<div className="category-row">
  {topCategories.slice(3, 5).map((category, index) => (
    <div key={index} className="category-item">
      <div className="category-label">
        <span
          style={{
            display: 'inline-block',
            width: '7px',
            height: '57px',
            backgroundColor: category.color,
            marginRight: '16px',
          }}
        ></span>
        <div style={{ display: 'inline-block' }}>
          <span>{index + 4}. {category.name}</span>
          <div className="category-value">
            <span>
              ${Math.floor(category.value)}
            </span>
            <span style={{ color: "#00000080" }}>
              .
              {(category.value % 1).toFixed(2).split('.')[1]}
            </span>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


</div>





<div className="CategoriesAndStatistics-pie-chart">
  <ResponsiveContainer width="100%" height={400}> 
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        startAngle={180}
        endAngle={0}
        innerRadius={80}
        outerRadius="80%"
        fill="#8884d8"
        paddingAngle={0}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  </ResponsiveContainer>
</div>

        </div>
      </div>
    </MainContainer>
  );
}

export default CategoriesAndStatistics;