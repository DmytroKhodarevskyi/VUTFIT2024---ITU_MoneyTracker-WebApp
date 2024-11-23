import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const CreateTransactionAdmin = () => {
  const { pk } = useParams(); 
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    currency: "USD",
    transaction_type: "INCOME",
    transaction_datetime: new Date().toISOString().slice(0, 16), 
  });

  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchCategories = async () => {
      try {
        const response = await api.get(`/api/custom_admin/users/${pk}/categories/`);
        setCategoriesList(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.response || error.message);
        alert("Failed to load categories.");
      }
    };

    fetchCategories();
  }, [pk]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
        alert("Transaction title is required.");
        setLoading(false);
        return;
    }

    if (formData.amount <= 0) {
        alert("Amount must be greater than 0.");
        setLoading(false);
        return;
    }

    if (!formData.category) {
        alert("Category is required.");
        setLoading(false);
        return;
    }
    if (formData.amount > 999999999) {
        alert("Transaction amount is too large");
        setLoading(false);
        return;
      }

    const payload = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        currency: formData.currency,
        transaction_type: formData.transaction_type,
        transaction_datetime: new Date(formData.transaction_datetime).toISOString(),
        incomeOrSpend: formData.transaction_type === "INCOME",
        created_at: new Date().toISOString(),
    };

    console.log("Payload:", payload);

    try {
        await api.post(`/api/custom_admin/user/${pk}/transactions/`, payload);
        alert("Transaction created successfully!");
        navigate(`/custom-admin/users/${pk}/transactions`);
    } catch (error) {
        console.error("Error creating transaction:", error.response || error.message);
        alert(
            `Error: ${
                error.response?.data?.detail || "An error occurred while creating the transaction."
            }`
        );
    } finally {
        setLoading(false);
    }
};


  return (
    <form onSubmit={handleSubmit} className="admin-main">
      <h1 className="admin-header">Create New Transaction</h1>

      <div className="admin-input-container">
        <input
          type="text"
          name="title"
          placeholder="Transaction Title*"
          value={formData.title}
          onChange={handleInputChange}
          required
          
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount*"
          value={formData.amount}
          onChange={handleInputChange}
          required
          
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
          
        >
          <option value="" disabled>
            Select a category
          </option>
          {categoriesList.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          name="currency"
          value={formData.currency}
          onChange={handleInputChange}
          required
          
        >
          <option value="USD">USD (United States Dollar)</option>
          <option value="CZK">CZK (Czech Koruna)</option>
          <option value="EUR">EUR (Euro)</option>
        </select>

        <select
          name="transaction_type"
          value={formData.transaction_type}
          onChange={handleInputChange}
          required
          
        >
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <input
          type="datetime-local"
          name="transaction_datetime"
          value={formData.transaction_datetime}
          onChange={handleInputChange}
          required
          
        />
      </div>

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Creating..." : "Create Transaction"}
      </button>
    </form>
  );
};

export default CreateTransactionAdmin;
