import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api";
import "./Admin.css";

const TransactionsEdit = () => {
  const { pk } = useParams(); // Use pk to extract the ID from the URL

  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleDeleteSelected = async () => {
    if (selectedTransactions.length === 0) {
      alert("Please select transactions to delete.");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected transactions?"
    );
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/custom_admin/transactions/batch-delete/`, {
        data: { transaction_ids: selectedTransactions },
      });

      setTransactions(
        transactions.filter(
          (transaction) => !selectedTransactions.includes(transaction.id)
        )
      );
      setSelectedTransactions([]); // Clear selection
    } catch (err) {
      console.error(err);

      if (err.response.status === 403) {
        navigate("/login");
      }
      setError("Failed to delete transactions");
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
        const response = await api.get(
          `/api/custom_admin/users/${pk}/transactions/`
        );

        const username = await api.get(
          `/api/custom_admin/users/${pk}/username/`
        );

        setUsername(username.data.username);

        setTransactions(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [pk]); // Use pk as a dependency to fetch the correct user

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  if (transactions.length === 0) {
    return (
      <>
        <div className="admin-main-buttons">
          <h1 className="admin-header">{username}'s Categories</h1>
          <h1 className="admin-header">No transactions was found</h1>
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
        <ul className="admin-userlist">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="admin-useritem">
              <input
                type="checkbox"
                checked={selectedTransactions.includes(transaction.id)}
                onChange={() => toggleTransactionSelection(transaction.id)}
              />
              <h1 className="admin-user-label">TITLE:</h1>
              <h2 className="admin-user-value">{transaction.title}</h2>
              <h1 className="admin-user-label">CREATED_AT:</h1>
              <h2 className="admin-user-value">{transaction.created_at}</h2>
              <h1 className="admin-user-label">AMOUNT:</h1>
              <h2 className="admin-user-value">{transaction.amount}</h2>
              <h1 className="admin-user-label">TYPE:</h1>
              <h2 className="admin-user-value">
                {transaction.transaction_type === "INCOME"
                  ? "Income"
                  : "Expense"}
              </h2>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TransactionsEdit;
