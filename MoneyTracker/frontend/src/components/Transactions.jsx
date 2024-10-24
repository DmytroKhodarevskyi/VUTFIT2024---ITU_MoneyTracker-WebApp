import React from 'react'
import api from "../api"
import { useState, useEffect } from "react"
import "../styles/Transactions.css"

function Transactions({}) {

    const [transactions, setTransactions] = useState([]);
    const [categoryNames, setCategoryNames] = useState([]);
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

                const data = response.data; 
                const categoryPromises = data.map(async (transaction) => {
                    const categoryResponse = await api.get(`/api/categories/${transaction.category}/`);
                    return {
                        id: transaction.category,
                        name: categoryResponse.data.name,
                    };
                });

                const categories = await Promise.all(categoryPromises);

                const transactionsWithCategoryNames = data.map((transaction) => {
                    const category = categories.find(cat => cat.id === transaction.category);
                    return {
                        ...transaction,
                        categoryName: category.name,
                    };
                });
        
                setTransactions(transactionsWithCategoryNames);
                setCategoryNames(categories);
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

    const truncateTitle = (title, maxLength) => {
        if (title.length > maxLength) {
            return title.substring(0, maxLength) + '...';
        }
        return title;
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
                    <h2 className='transaction-title'>
                        {truncateTitle(transaction.title, 12)}
                        {/* {transaction.title} */}
                    </h2>
                    <h2 className='transaction-category'>{transaction.categoryName}</h2>
                    </div>

                    <h2 className='transaction-date'>{formatDate(transaction.transaction_datetime)}</h2>
                </div>

                {
                    // transaction.incomeOrSpend ? (
                    //     <h2 className='transaction-income'>+{currency}{transaction.amount}</h2>  
                    // ) : (
                    //     <h2 className='transaction-spend'>-{currency}{transaction.amount}</h2>  
                    // )

                    transaction.transaction_type === 'INCOME' ? (
                        <h2 className='transaction-income'>+{currency}{transaction.amount}</h2>  
                        // <h2 className='transaction-income'>+{currency}{truncateTitle(transaction.amount, 5)}</h2>  
                    ) : (
                        <h2 className='transaction-spend'>-{currency}{transaction.amount}</h2>
                        // <h2 className='transaction-spend'>-{currency}{truncateTitle(transaction.amount, 5)}</h2>  
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