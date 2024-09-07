import { useState, useEffect } from "react"
import api from "../api"
import "../styles/Update.css"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import NewTransactions from "../components/NewTransactions"

import Transactions from "../components/Transactions"

// import ClipLoader from "react-spinners/ClipLoader";

function Home() {

    const currency = "$";

    const [nickname, setNickname] = useState("")

    const [isLoaded, setIsLoaded] = useState(false);


    useEffect(() => {
        const fetchNickname = async () => {
          try {
            const response = await api.get("/api/user/profile/");
            // setNickname(response.data.username);
            setNickname(response.data.first_name);
            setIsLoaded(true); // Mark data as loaded
          } catch (error) {
            console.error("Failed to fetch nickname", error);
            setIsLoaded(true); // Even if there’s an error, consider data loaded to prevent infinite loading
          }
        };
    
        fetchNickname();
      }, []);


    if (!isLoaded) {
        // Optionally, you can return a loading spinner or some placeholder content here
        return (
            // <div className="loading-spinner">
            //     <ClipLoader color={"#123abc"} loading={!isLoaded} size={150} />
            // </div>
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
                <TopPart nickname={nickname} selectedItem={"update"}/>
               
                <div className="cards-container">
                    <NewTransactions />

                </div>

            </MainContainer>
        </>
    )
}

export default Home;