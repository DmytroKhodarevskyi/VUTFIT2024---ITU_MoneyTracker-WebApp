import { useState, useEffect } from "react"
import api from "../api"
import "../styles/Home.css"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import SummaryCard from "../components/SummaryCard"
import WalletIcon from "../assets/wallet-icon.svg"
import BagIcon from "../assets/BagIcon.svg"
import CardIcon from "../assets/CardIcon.svg"


import Transactions from "../components/Transactions"
import BarChart from "../components/BarChart.jsx"


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
                <TopPart nickname={nickname} selectedItem={"overview"}/>
                <div className="SummaryCards-container">
                    <SummaryCard 
                        title={"Total Balance"}
                        date={"2 September - 1 July 2024"}
                        amount={currency + "1.000.000,01"}
                        trends={"+52% LastYear"}
                        style_trends={{color: '#00BCD4'}}
                        img_src={WalletIcon}
                    />
                    <SummaryCard 
                        title={"Total Income"}
                        date={"2 September - 1 July 2024"}
                        amount={currency + "520.000,01"}
                        trends={"+12% Last Month"}
                        style_trends={{color: '#4CAF50'}}
                        img_src={CardIcon}
                    />
                    <SummaryCard 
                        title={"Total Spending"}
                        date={"2 September - 1 July 2024"}
                        amount={"-" + currency + "228.000,00"}
                        trends={"+15% LastYear"}
                        style_trends={{color: '#F44336'}}
                        img_src={BagIcon}
                    />
                </div>
                <div className="trans-graph-container">
                    <Transactions />
                    <BarChart />
                </div>

            </MainContainer>
        </>
    )
}

export default Home;