import { useState, useEffect } from "react"
import api from "../api"
import "../styles/Home.css"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import SummaryCard from "../components/SummaryCard"

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
                        img_src={"somepath"}
                    />
                </div>
            </MainContainer>
        </>
    )
}

export default Home;