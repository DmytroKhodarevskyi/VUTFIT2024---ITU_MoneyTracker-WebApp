import React, { useState, useEffect } from "react";
import api from "../../api";
import MainContainer from "../../components/MainContainer/MainContainer";
import TopPart from "../../components/TopPart/TopPart";
import "./CategoriesAndStatistics.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function CategoriesAndStatistics() {
  const [categories, setCategories] = useState([]); 
  const [transactions, setTransactions] = useState([]); 
  const [topCategories, setTopCategories] = useState([]); 
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [profileData, setProfileData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesListResponse = await api.get("/api/categories/"); 
        const profileResponse = await api.get("/api/user/profile/");
        const transactionsListResponse = await api.get("/api/transactions/"); 
        setProfileData(profileResponse.data);
        setProfilePhoto(profileResponse.data.profileImg);
        setCategories(categoriesListResponse.data);
        setTransactions(transactionsListResponse.data);

        const calculatedTopCategories = getTopCategories(
          categoriesListResponse.data,
          transactionsListResponse.data
        );
        
        setTopCategories(calculatedTopCategories);
        setIsLoaded(true);
        
      } catch (error) {
        window.alert("Failed to fetch profile", error);
        setError(error);
        setIsLoaded(false);
      }
    }
    fetchData();
  }, []);

  const getTopCategories = (categories, transactions) => {
    const categorySpending = {};

    transactions.forEach((transaction) => {
        const { category, amount } = transaction;

        if (!categorySpending[category]) {
            categorySpending[category] = 0;
        }

        categorySpending[category] += parseFloat(amount);
    });

    const spendingData = categories.map((category) => ({
        name: category.name,
        value: categorySpending[category.id] || 0,
        color: category.color,
    }));

    spendingData.sort((a, b) => b.value - a.value);

    const top5 = spendingData.slice(0, 5);
    while (top5.length < 5) {
        top5.push({ name: "-", value: 0, color: "grey" });
    }

    return top5;
};

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

    const defaultCategory = categories.find(
      (category) => selectedCategories.includes(category.id) && category.name === "Default"
    );

    if (defaultCategory) {
        alert('You cannot delete the default category with the name "Default".');
        return;
    }

    try {
        await Promise.all(
            selectedCategories.map(async (categoryId) => {
                await api.delete(`/api/categories/${categoryId}/delete/`);
            })
        );

        setCategories(categories.filter((category) => !selectedCategories.includes(category.id)));
        setSelectedCategories([]);
    } catch (error) {
        console.log(error)
        console.error('There was an error deleting the categories:', error);
        alert('Failed to delete the selected categories. Please try again.');
      }

      window.location.reload();
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
                      <span>{index + 1}. {category.name}</span>
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
                  data={topCategories} 
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
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
