/**
 * File: TransactionList.jsx
 * Description: Page for viewing and managing transactions.
 * Author: Rostyslav Kachan
 * 
 * Notes:
 * - _
 */


import React, { useState, useEffect } from "react";
import api from "../../api";
import MainContainer from "../../components/MainContainer/MainContainer";
import TopPart from "../../components/TopPart/TopPart";
import "./TransactionsList.css"
import Notification from "../../components/Notifications/Notifications";

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("uk-UA")} ${date.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' })}`;
}




function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [categoryNames, setCategoryNames] = useState([]);
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const transactionsListResponse = await api.get("/api/transactions/");
        const data = transactionsListResponse.data;
        const profileResponse = await api.get("/api/user/profile/");

        const categoryPromises = data.map(async (transaction) => {
          const categoryResponse = await api.get(`/api/categories/${transaction.category}/`);
          return {
              id: transaction.category,
              name: categoryResponse.data.name,
              color: categoryResponse.data.color,
          };
      });
      const categories = await Promise.all(categoryPromises);
      const transactionsWithCategoryNames = data.map((transaction) => {
        const category = categories.find(cat => cat.id === transaction.category);
        return {
            ...transaction,
            categoryName: category.name,
            categoryColor: category.color,
        };
    });
        
        setProfileData(profileResponse.data);
        setProfilePhoto(profileResponse.data.profileImg);
        setTransactions(transactionsWithCategoryNames);
        setCategoryNames(categories);
        setIsLoaded(true);
      } catch (error) {
        
        setNotification({
          message: "Failed to fetch profile",
          type: "error",
        });
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

  const handleCheckboxChange = (transaction) => {
    if (selectedTransactions.includes(transaction.id)) {
      setSelectedTransactions(
        selectedTransactions.filter((id) => id !== transaction.id)
      );
    } else {
      setSelectedTransactions([...selectedTransactions, transaction.id]);
    }
  };
  const closeNotification = () => {
    setNotification(null); 
  };
  const handleDelete = async () => {
    if (selectedTransactions.length === 0) {
      
      setNotification({
        message: "Please select at least one transaction to delete.",
        type: "error",
      });
      return;
    }

    try {
      await Promise.all(
        selectedTransactions.map(async (transactionId) => {
          console.log(transactionId);
          await api.delete(`/api/transactions/${transactionId}/delete/`);
        })
      );

      setTransactions(
        transactions.filter(
          (transaction) => !selectedTransactions.includes(transaction.id)
        )
      );

      setSelectedTransactions([]);
    } catch (error) {
      console.error("There was an error deleting the transactions:", error);
      
      setNotification({
        message: "Failed to delete the selected transactions. Please try again.",
        type: "error",
      });
    }
  };

  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode.toUpperCase()) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "CZK":
        return "Kč";
      default:
        return currencyCode;
    }
  };

  return (
    <MainContainer>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <TopPart
        nickname={profileData.first_name}
        selectedItem={"update"}
        profilePhoto={profilePhoto}
      />
      <div className="TransactionsList-container">
        <div className="TransactionsList-text-block">
          <h2 className="TransactionsList-text-h2">Your Transactions</h2>
          <div className="TransactionsList-info">
            <p className="TransactionsList-subtext">
              Here are all of your transactions
            </p>
            <p>
              {selectedTransactions.length} row(s) of {transactions.length}{" "}
              selected.
            </p>
            <button
              className="TransactionsList-delete-text"
              onClick={handleDelete}
            >
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
                      <label style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          name="transaction"
                          value={transaction.name}
                          checked={selectedTransactions.includes(
                            transaction.id
                          )}
                          onChange={() => handleCheckboxChange(transaction)}
                        />
                        <span className="TransactionsList-checkbox"></span>
                        {transaction.title}
                      </label>
                    </td>
                    <td>
                      <span
                        style={{
                          color: transaction.incomeOrSpend ? "green" : "red",
                        }}
                      >
                        {transaction.incomeOrSpend ? "+" : "-"}{" "}
                        {transaction.amount}
                      </span>
                    </td>
                    <td>{getCurrencySymbol(transaction.currency)}</td>
                    <td>{formatDate(transaction.transaction_datetime)}</td>
                    <td>
                      <span
                        style={{
                          backgroundColor: transaction.categoryColor,
                          display: "inline-block",
                          width: "25px",
                          height: "25px",
                          borderRadius: "25%",
                        }}
                      ></span>
                      <span style={{ marginLeft: "8px" }}>
                        {transaction.categoryName || "Unknown category"}
                      </span>
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
