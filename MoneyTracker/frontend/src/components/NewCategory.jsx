import React, { useState, useEffect } from 'react'
import {useNavigate } from 'react-router-dom';
import "../styles/NewTransactionCard.css"
import Picker from "../assets/ColorPickIcon.svg"
import ColorPicker from './ColorPicker';

function NewTransactionCard() {

    const [date, setDate] = useState('');

    const [IncomeOrSpend, setIncomeOrSpend] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false); // Track animation state

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        setDate(formattedDate);
    }, []);

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleIncomeOrSpend = (e) => {
        setIsAnimating(true); // Start animation
        setTimeout(() => {
            setIncomeOrSpend(!IncomeOrSpend);
            setIsAnimating(false); // Reset after animation
        }, 100); // Match timeout with animation duration (0.5s)
    }

    const navigate = useNavigate();
    const handleStatistics = () => {
        
        navigate('/categories-statistics');
    };

  return (
    <>
        <div className='right-container'>

            <div className='card-category'>
                <div className='card-title-container'>
                    <h1 className='card-title'>Add New Category</h1>
                    <h2 className='card-title-hint'>Sort your payments as you prefer</h2>
                </div>

                <div className="card-category-container">

                    <div className='card-amount-input-title-container-category'>
                            <div className="card-amount-container">
                                <h1 className='card-input-title'>Category Name</h1>
                            </div>
                            <input
                                className='card-input-category' 
                                type="text"
                                min="0"
                            />
                    </div>

                    <div className='picker-text-icon-container'>
                        <h2 className='card-title-hint'>Pick color</h2>
                        <div className='picker-container'>
                            {/* <div className='color-square'></div> */}
                            <ColorPicker></ColorPicker>
                            <img src={Picker} alt="Picker" />
                        </div>
                    </div>
                </div>

                <button className='add-button-category'>
                    Add
                </button>

            </div>

            <div className='card-buttons'>
                <button className='blue-buttons'> Transaction List </button>
                <button className='blue-buttons'onClick={handleStatistics}> Category List </button>
            </div>
        </div>

    </>
  )
}

export default NewTransactionCard