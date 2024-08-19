import { useState, useEffect } from "react"
import api from "../api"
import "../styles/Home.css"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import SummaryCard from "../components/SummaryCard"
import WalletIcon from "../assets/wallet-icon.svg"
import BagIcon from "../assets/BagIcon.svg"
import CardIcon from "../assets/CardIcon.svg"

function Home() {

    const currency = "$";

    return (
        <>
            <MainContainer>
                <TopPart />
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
                        amount={currency + "228.000,00"}
                        trends={"+15% LastYear"}
                        style_trends={{color: '#F44336'}}
                        img_src={BagIcon}
                    />
                </div>
            </MainContainer>
        </>
    )
}

export default Home;