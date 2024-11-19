import React, { useState, useEffect } from 'react'
import "./NewTransactionCard.css"
import Plus from "../../assets/PlusIcon.svg"
import Minus from "../../assets/MinusIcon.svg"
import api from "../../api"

function NewTransactionCard() {

    const [date, setDate] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState(0);
    const [name, setName] = useState('');
    
    const [currency, setCurrency] = useState('USD (United States Dollar)');
    const [IncomeOrSpend, setIncomeOrSpend] = useState(true);

    const [IncOrSpndHint, setIncOrSpndHint] = useState('This will count as Income');

    const [isAnimating, setIsAnimating] = useState(false); // Track animation state

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 16);
        setDate(formattedDate);
    }, []);

    
    useEffect(() => {
        const fetchCategories = async () => {
          try {
            
            const response = await api.get("/api/categories/");
            // setNickname(response.data.username);
            
            setCategoriesList(response.data);
            
          
          } catch (error) {
            console.error("Failed to fetch nickname", error);
            
          }
        };
    
        fetchCategories();
      }, []);


    const handleSubmit = async () => {

        if (name === '') {
            alert('Transaction title is required');
            return;
        }

        if (amount <= 0) {
            alert('Transaction amount must be greater than 0');
            return;
        }

        if (amount > 999999999) {
            alert('Transaction amount is too large');
            return;
        }

        if (!category || category.trim() === '') {
            alert('Transaction category is required');
            return;
        }

        const transactionData = {
            title: name,  // Assuming title corresponds to name
            category: category,
            transaction_datetime: date,  // Map date to transaction_datetime
            currency: currency.split(" ")[0].toLowerCase(),  // Extract the currency code like "USD"
            transaction_type: IncomeOrSpend ? 'INCOME' : 'EXPENSE',  // Map the boolean to the transaction type
            amount: parseFloat(amount).toFixed(2),  // Convert amount to decimal format with 2 decimal places
            incomeOrSpend: IncomeOrSpend,  // This boolean field seems optional based on your structure
        };

     

        try {
            
            const response = await api.post("/api/transactions/", transactionData);
            window.alert('Transaction created');
        } catch (error) {
            console.error('There was an error creating the transaction:', error);
        }

    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleIncomeOrSpend = (e) => {
        setIsAnimating(true); // Start animation
        setTimeout(() => {
            setIncomeOrSpend(!IncomeOrSpend);

            if (IncomeOrSpend == true) {
                setIncOrSpndHint('This will count as Expense');
            } else {    
                setIncOrSpndHint('This will count as Income');
            }

            setIsAnimating(false); // Reset after animation
        }, 100); // Match timeout with animation duration (0.5s)
    }

 console.log(categoriesList)
  return (
    <>
          <div className='card-trans'>
            <div className='card-title-container'>
                <h1 className='card-title'>Add New Transaction</h1>
                <h2 className='card-title-hint'>Update your payment statistics</h2>
            </div>

            <div className="card-inputs-container">

                <div className="card-transaction-top-container">

                    <div className="card-amount-input-title-container">
                        <h1 className='card-input-title'>Title</h1>
                        <input 
                            className='card-input-currency' 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Title*"
                    />
                    </div>

                    <div className='card-amount-input-title-container'>
                        <div className='card-amount-container'>
                            <h1 className='card-input-title'>Amount</h1>
                            <h2 className='card-input-hint'>{IncOrSpndHint}</h2>
                        </div>

                        <div className='card-amount-button-container'>
                            <input
                                className='card-input' 
                                type="number"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount (Number)*"

                            />
                            {IncomeOrSpend == true && (
                                    <img className={`card-button ${isAnimating ? "fade-out" : "fade-in"}`}  src={Plus} onClick={handleIncomeOrSpend} alt="Plus" draggable="false"/>
                                )
                            }
                            {IncomeOrSpend == false && (
                                    <img className={`card-button ${isAnimating ? "fade-out" : "fade-in"}`} src={Minus} onClick={handleIncomeOrSpend} alt="Minus" draggable="false"/>
                                )
                            }
                        </div>
                    </div>

                </div>


                <div className="card-currency-date-container">
                    <div className='card-amount-input-title-container'>
                        <h1 className='card-input-title'>Payment Currency</h1>
                        {//TODO: add custom picker or fix the arrow position
                        }
                        <select 
                            id="picker-currency" 
                            className="card-input-currency" 
                            value={currency}
                            onChange={e => {setCurrency(e.target.value)}}>
                            <option value="USD (United States Dollar)">USD (United States Dollar)</option>
                            <option value="CZK (Czech Koruna)">CZK (Czech Koruna)</option>
                            <option value="EUR (Euro)">EUR (Euro)</option>
                        </select>
                    </div>

                    <div className='card-amount-input-title-container'>
                        <h1 className='card-input-title'>Payment Date</h1>
                        {//TODO: add custom date picker 
                        }
                        <input 
                            type="datetime-local" 
                            className='card-input-date' 
                            value={date}
                            onChange={handleDateChange}
                            />
                    </div>
                </div>

                <div className='card-amount-input-title-container'>
                        <div className="card-amount-container">
                            <h1 className='card-input-title'>Category</h1>
                            <h2 className='card-input-hint'>Select category, or create a new one</h2>
                        </div>
                        {//TODO: add custom picker or fix the arrow position
                        }
                        <select 
                            id="picker-category" 
                            className="card-input-currency" 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="" disabled>Select a category</option>
                                {categoriesList.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                        </select>
                </div>
            </div>

            <button className='add-button' onClick={handleSubmit}>
                 Add
            </button>

          </div>
    </>
  )
}

export default NewTransactionCard