import React, { useState, useEffect } from 'react'
import {useNavigate } from 'react-router-dom';
import "./NewTransactionCard.css"
import Picker from "../../assets/ColorPickIcon.svg"
import ColorPicker from './ColorPicker';
import api from "../../api";
import Notification from '../Notifications/Notifications';

function NewTransactionCard() {

    const [date, setDate] = useState('');

    const [IncomeOrSpend, setIncomeOrSpend] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false); 
    const [categoryName, setCategoryName] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [categoryColor, setCategoryColor] = useState("#000000");
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        setDate(formattedDate);
    }, []);

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleIncomeOrSpend = (e) => {
        setIsAnimating(true); 
        setTimeout(() => {
            setIncomeOrSpend(!IncomeOrSpend);
            setIsAnimating(false); 
        }, 100); 
    }
    const handleColorChange = (newColor) => {
        setCategoryColor(newColor); 
        
        
    };
    const closeNotification = () => {
        setNotification(null); 
      };
    const handleSubmit = async () => {
        if (categoryName === '') {
            
            
        setNotification({
        message: "Category name is required",
        type: "error",
        });
            return;
        }

        const categoryData = {
            name: categoryName,  
            color: categoryColor,
        };

        try {
    
            const responseList = await api.get("/api/categories/", categoryList);
            const existingCategories = responseList.data;

            const duplicateCategory = existingCategories.find(
                (category) => category.name === categoryName
            );
    
            if (duplicateCategory) {
                
                setNotification({
                    message: "Category with this name already exists",
                    type: "error",
                    });
                return; 
            }


            
    
            const response = await api.post("/api/categories/create/", categoryData);
            console.log('Category created:', response.data);

            setCategoryList([...categoryList, response.data]);
        } catch (error) {
            console.error('There was an error creating the category:', error);
            console.log('Checkobj:', categoryData);
            
        }
        
        window.location.reload();
    }

    const navigate = useNavigate();
    const handleStatistics = () => {
        
        navigate('/categories-statistics');
    };

    const handleTransactionsList = () => {
        
        navigate('/transactions-list');
    };

  return (
    <>
        <div className='right-container'>
        {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

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
                                maxLength="99" 
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Name*"
                            />
                    </div>

                    <div className='picker-text-icon-container'>
                        <h2 className='card-title-hint'>Pick color</h2>
                        <div className='picker-container'>
                            
                            <ColorPicker onChange={handleColorChange} />
                            <img src={Picker} alt="Picker" />
                        </div>
                    </div>
                </div>

                <button className='add-button-category' onClick={handleSubmit}>
                    Add
                </button>

            </div>

            <div className='card-buttons'>
                <button className='blue-buttons'onClick={handleTransactionsList}> Transaction List </button>
                <button className='blue-buttons'onClick={handleStatistics}> Category List </button>
            </div>
        </div>

    </>
  )
}

export default NewTransactionCard