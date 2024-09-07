import React, { useState, useEffect } from 'react'
import "../styles/NewTransactionCard.css"
import Plus from "../assets/PlusIcon.svg"

function NewTransactionCard() {

    const [date, setDate] = useState('');

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        setDate(formattedDate);
    }, []);

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

  return (
    <>
          <div className='card-trans'>
            <div className='card-title-container'>
                <h1 className='card-title'>Add New Transaction</h1>
                <h2 className='card-title-hint'>Update your payment statistics</h2>
            </div>

            <div className='card-amount-input-title-container'>
                <div className='card-amount-container'>
                    <h1 className='card-input-title'>Amount</h1>
                    <h2 className='card-input-hint'>This will count as Income</h2>
                </div>

                <div className='card-amount-button-container'>
                    <input
                        className='card-input' 
                        type="number"
                        min="0"

                    />
                    <img className='card-button' src={Plus} alt="Plus" draggable="false"/>
                </div>
            </div>

            <div className="card-currency-date-container">
                <div className='card-amount-input-title-container'>
                    <h1 className='card-input-title'>Payment Currency</h1>
                    {//TODO: add custom picker or fix the arrow position
                    }
                    <select id="picker-currency" className="card-input-currency">
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
                        type="date" 
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
                    <select id="picker-category" className="card-input-currency">
                        <option value="Groceries">Groceries</option>
                        <option value="Direct Payment">Direct Payment</option>
                        <option value="Sports">Sports</option>
                    </select>
            </div>

          </div>
    </>
  )
}

export default NewTransactionCard