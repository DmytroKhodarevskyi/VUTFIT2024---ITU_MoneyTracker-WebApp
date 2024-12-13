/**
 * File: Update.jsx
 * Description: Page for creating new transactions and categories.
 * Author: Dmytro Khodarevskyi
 * 
 * Notes:
 * - _
 */


import { useState, useEffect } from "react"
import api from "../../api"
import "./Update.css"
import MainContainer from "../../components/MainContainer/MainContainer"
import TopPart from "../../components/TopPart/TopPart";
import NewTransactions from "../../components/NewTransaction/NewTransactions"
import NewCategory from "../../components/NewCategory/NewCategory"

import Transactions from "../../components/Transactions/Transactions"



function Update() {

    const currency = "$";

    const [nickname, setNickname] = useState("")

    const [isLoaded, setIsLoaded] = useState(false);

    const [profilePhoto, setProfilePhoto] = useState(null)


    useEffect(() => {
        const fetchNickname = async () => {
          try {
            
            const response = await api.get("/api/user/profile/");
            
            setNickname(response.data.first_name);
            setProfilePhoto(response.data.profileImg);
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

    return (
        <>
            <MainContainer>
                <TopPart nickname={nickname} selectedItem={"update"} profilePhoto={profilePhoto}/>
               
                <div className="cards-container">
                    <NewTransactions />
                    <NewCategory />
                </div>

            </MainContainer>
        </>
    )
}

export default Update;