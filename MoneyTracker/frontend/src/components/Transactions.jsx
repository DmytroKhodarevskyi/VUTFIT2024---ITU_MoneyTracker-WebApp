import React from 'react'
import api from "../api"
import { useState, useEffect } from "react"
import "../styles/Transactions.css"

function Transactions({}) {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
    // Replace this URL with your actual API endpoint
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/api/transactions/');
                // console.log(response);

                if (response.status !== 200) {
                    console.error("Error fetching transactions");
                    throw new Error('Network response was not ok');
                }

                const data = response.data; // Assuming you're using axios or a similar library
                setTransactions(data);
            } catch (error) {
                setError(error.message);
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date);
    };

    const currency = "$";

  return (
    <>
    <div className='transactions-container'>
        <h1 className='transactions-header'>Transactions</h1>

        {/* Transactions list here, maximum 5 */}

        <ul>
        {transactions.slice(0, 5).map((transaction) => (
          <li key={transaction.id}>
            <div className='transaction-container'>

                <div className='transaction-title-date-container'>
                    <div className='transaction-title-container'>
                    <h2 className='transaction-title'>{transaction.title}</h2>
                    <h2 className='transaction-category'>{transaction.category}</h2>
                    </div>

                    <h2 className='transaction-date'>{formatDate(transaction.created_at)}</h2>
                </div>

                {
                    transaction.incomeOrSpend ? (
                        <h2 className='transaction-income'>+{currency}{transaction.amount}</h2>  
                    ) : (
                        <h2 className='transaction-spend'>-{currency}{transaction.amount}</h2>  
                    )
                }

            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  )
}

export default Transactions