import React, { useState, useEffect } from "react";
import api from "../api";
import MainContainer from "../components/MainContainer";
import TopPart from "../components/TopPart";
import "../styles/TransactionsList.css";

const transactions = [
    { id: 1, name: "Groceries", amount: 500, currency: "$", date: "21.09.2024 15:44", category: "Groceries", color: "green", isPositive: true },
    { id: 2, name: "Direct Payment", amount: 500, currency: "$", date: "21.09.2024 15:44", category: "Groceries", color: "green", isPositive: true },
    { id: 3, name: "Medical", amount: 500, currency: "$", date: "21.09.2024 15:44", category: "Groceries", color: "green", isPositive: true },
    { id: 4, name: "Entertainment", amount: 500, currency: "$", date: "21.09.2024 15:44", category: "Groceries", color: "green", isPositive: false },
    { id: 5, name: "Name", amount: 500, currency: "$", date: "21.09.2024 15:44", category: "Groceries", color: "green", isPositive: false },
    { id: 6, name: "Name", amount: 500000000000, currency: "$", date: "21.09.2024 15:44", category: "Groceries", color: "green", isPositive: false },
  ];


function TransactionsList(){
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
      <div className="TransactionsList-container">
        <div className="TransactionsList-text-block">
          <h2 className="TransactionsList-text-h2">Your Transactions</h2>
          <div className="TransactionsList-info">
            <p className="TransactionsList-subtext">Here are all of your transactions</p>
            <p>{selectedCategories.length} row(s) of {transactions.length} selected.</p>
            <button className="TransactionsList-delete-text" onClick={handleDelete}>
              Delete Selected
            </button>
          </div>
          <div className="TransactionsList-table-block">
            <table className="TransactionsList-table">
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
                      <label style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="checkbox" 
                          name="transaction" 
                          value={transaction.name} 
                          checked={selectedCategories.includes(transaction.id)}
                          onChange={() => handleCheckboxChange(transaction)} 
                        />
                        <span className="TransactionsList-checkbox"></span>
                        {transaction.name}
                      </label>
                    </td>
                    <td>
                      <span style={{ color: transaction.isPositive ? 'green' : 'red' }}>
                        {transaction.isPositive ? '+' : '-'} {transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td>{transaction.currency}</td>
                    <td>{transaction.date}</td>
                    <td>
                      <span
                        style={{
                          backgroundColor: transaction.color,
                          display: 'inline-block',
                          width: '25px',
                          height: '25px',
                          borderRadius: '25%',
                        }}
                      ></span>
                      <span style={{ marginLeft: '8px' }}>{transaction.category}</span>
                    </td>
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

export default TransactionsList;