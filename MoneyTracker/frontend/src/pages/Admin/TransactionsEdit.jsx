import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "./Admin.css";

const TransactionsEdit = () => {
  const { pk } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [username, setUsername] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [fieldBeingEdited, setFieldBeingEdited] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // const formatDate = (dateString) => {
  //   if (!dateString) return "Invalid date";
  //   try {
  //     const date = new Date(dateString);
  //     if (isNaN(date.getTime())) {
  //       return "Invalid date";
  //     }
  //     const day = String(date.getDate()).padStart(2, "0");
  //     const month = String(date.getMonth() + 1).padStart(2, "0");
  //     const year = date.getFullYear();
  //     const hours = String(date.getHours()).padStart(2, "0");
  //     const minutes = String(date.getMinutes()).padStart(2, "0");
  //     const seconds = String(date.getSeconds()).padStart(2, "0");
  //     return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  //   } catch (error) {
  //     console.error("Error formatting date:", error);
  //     return "Invalid date";
  //   }
  // };

  const handleDoubleClick = (transactionId, currentValue, field) => {
    setEditingTransaction(transactionId);
    setTempValue(currentValue);
    setFieldBeingEdited(field);
  };

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleDeleteSelected = async () => {
    if (selectedTransactions.length === 0) {
      alert("Please select transactions to delete.");
      return;
    }

    try {
      await api.delete(`/api/custom_admin/transactions/batch-delete/`, {
        data: { transaction_ids: selectedTransactions },
      });

      setTransactions(
        transactions.filter(
          (transaction) => !selectedTransactions.includes(transaction.id)
        )
      );
      setSelectedTransactions([]);
    } catch (err) {
      console.error(err);
      if (err.response.status === 403) {
        navigate("/login");
      }
      setError("Failed to delete transactions");
    }
  };

  const handleSaveEdit = async (transactionId) => {
    try {
      let updatedValue = tempValue.trim();
      if (fieldBeingEdited === "title" && updatedValue === "") {
        updatedValue = "No transaction name";
      }

      if (fieldBeingEdited === "created_at") {
        updatedValue = new Date(tempValue).toISOString();
      }

      const payload = { [fieldBeingEdited]: updatedValue };

      await api.put(`/api/custom_admin/transactions/${transactionId}/`, payload);

      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === transactionId
            ? { ...transaction, [fieldBeingEdited]: updatedValue }
            : transaction
        )
      );

      setEditingTransaction(null);
      setFieldBeingEdited("");
    } catch (err) {
      console.error("Failed to update transaction", err);
      setError("Failed to update transaction");
    }
  };

  const toggleTransactionSelection = (id) => {
    setSelectedTransactions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((transactionId) => transactionId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/api/custom_admin/users/${pk}/transactions/`);
        const usernameResponse = await api.get(`/api/custom_admin/users/${pk}/username/`);
        const categoriesResponse = await api.get(`/api/custom_admin/users/${pk}/categories/`);

        const categoriesMap = categoriesResponse.data.reduce((acc, category) => {
          acc[category.id] = category;
          return acc;
        }, {});

        const transactionsWithCategories = response.data.map((transaction) => {
          const category = categoriesMap[transaction.category] || {};
          return {
            ...transaction,
            categoryName: category.name || "Unknown",
            categoryColor: category.color || "#000000",
            
          };
        });

        setUsername(usernameResponse.data.username);
        setTransactions(transactionsWithCategories);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Error loading transactions:", err.message);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [pk]);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  if (transactions.length === 0) {
    return (
      <>
        <div className="admin-main-buttons">
          <h1 className="admin-header">{username}'s Transactions</h1>
          <h1 className="admin-header">No transactions were found</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-main-buttons">
        <h1 className="admin-header">{username}'s Transactions</h1>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedTransactions.length === 0}
        >
          Delete Selected
        </button>
        <h1 className="admin-user-label">!!! Amount must be positive number</h1>
        <ul className="admin-userlist">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="admin-useritem">
              <input
                type="checkbox"
                checked={selectedTransactions.includes(transaction.id)}
                onChange={() => toggleTransactionSelection(transaction.id)}
              />
              <h1 className="admin-user-label">TITLE:</h1>
              {editingTransaction === transaction.id && fieldBeingEdited === "title" ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={handleInputChange}
                  onBlur={() => handleSaveEdit(transaction.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(transaction.id);
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="admin-user-value"
                  onDoubleClick={() =>
                    handleDoubleClick(transaction.id, transaction.title, "title")
                  }
                >
                  {transaction.title}
                </h2>
              )}
              
              <h1 className="admin-user-label">AMOUNT:</h1>
              {editingTransaction === transaction.id && fieldBeingEdited === "amount" ? (
                <input
                  type="number"
                  value={tempValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0) {
                      setTempValue(value);
                    }
                  }}
                  onBlur={() => handleSaveEdit(transaction.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(transaction.id);
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="admin-user-value"
                  onDoubleClick={() =>
                    handleDoubleClick(transaction.id, transaction.amount, "amount")
                  }
                >
                  {transaction.amount}
                </h2>
              )}
              <h1 className="admin-user-label">TYPE:</h1>
              {editingTransaction === transaction.id && fieldBeingEdited === "transaction_type" ? (
                <select
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={() => handleSaveEdit(transaction.id)}
                  autoFocus
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              ) : (
                <h2
                  className="admin-user-value"
                  onDoubleClick={() =>
                    handleDoubleClick(transaction.id, transaction.transaction_type, "transaction_type")
                  }
                >
                  {transaction.transaction_type === "INCOME" ? "Income" : "Expense"}
                </h2>
              )}
              <h1 className="admin-user-label">Category:</h1>
              <h2 className="admin-user-value">{transaction.categoryName}</h2>
              <div
                className="color-square"
                style={{
                  backgroundColor: transaction.categoryColor,
                  width: "20px",
                  height: "20px",
                  border: "1px solid white",
                  display: "inline-block",
                  marginRight: "10px",
                }}
              ></div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TransactionsEdit;
