/**
 * File: Admin.jsx
 * Description: The page for managing administrative tasks, including user management.
 * Author: Dmytro Khodarevskyi
 * 
 * Notes:
 * - Uses `UserList` to display a list of users.
 */
import { useState, useEffect } from "react"
import {useNavigate } from 'react-router-dom';
import "./Admin.css"

import api from "../../api"
import MainContainer from "../../components/MainContainer/MainContainer"
import UserList from "./UserList";

import AdminRoute from "./AdminRoute";


function Admin() {

    const navigate = useNavigate();

    
    const [isLoaded, setIsLoaded] = useState(false);

    

    useEffect(() => {
        const fetchNickname = async () => {
          try {
            
            setIsLoaded(true); 
          } catch (error) {
            console.error("Failed to fetch nickname", error);
            setIsLoaded(true);
          }
        };
    
        fetchNickname();
      }, []);


    if (!isLoaded) {
        
        return (
            
            <MainContainer>
                <div className="loading-container">
                    <h1 className="loading-text">Hold up, loading data...</h1>
                </div>
            </MainContainer>
        )
    }

    

    console.log("IS ADMIN");
    return (
        <>
            <MainContainer>
                
                <div className="admin-main">
                    <UserList />
                </div>
                
            </MainContainer>
        </>
    )
}

export default Admin;