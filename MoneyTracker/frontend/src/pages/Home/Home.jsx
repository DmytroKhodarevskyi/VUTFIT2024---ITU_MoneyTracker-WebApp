import { useState, useEffect } from "react"
import api from "../../api"
import "./Home.css"
import MainContainer from "../../components/MainContainer/MainContainer"
import TopPart from "../../components/TopPart/TopPart";
import SummaryCard from "../../components/SummaryCard/SummaryCard"
import WalletIcon from "../../assets/wallet-icon.svg"
import BagIcon from "../../assets/BagIcon.svg"
import CardIcon from "../../assets/CardIcon.svg"


import Transactions from "../../components/Transactions/Transactions"
import BarChart from "../../components/BarChart/BarChart"


// import ClipLoader from "react-spinners/ClipLoader";

function Home() {

    const currency = "$";

    const [nickname, setNickname] = useState("")

    const [isLoaded, setIsLoaded] = useState(false);

    const [profilePhoto, setProfilePhoto] = useState(null);
    const [accountCreatedDate, setAccountCreatedDate] = useState("");
    const [todayDate, setTodayDate] = useState("");

    const [Income, setIncome] = useState(0.0);
    const [Spending, setSpending] = useState(0.0);
    const [Balance, setBalance] = useState(0.0);



    useEffect(() => {   
        const today = new Date();
        const todayFormatted = today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
        setTodayDate(todayFormatted);
      }, []);

    const FindBalance = async () => {
        try {
            const response = await api.get("/api/transactions/");
            let income = 0;
            let spending = 0;
            response.data.forEach(transaction => {
                if (transaction.transaction_type === "INCOME") {
                    income += parseFloat(transaction.amount);
                } else {
                    spending += parseFloat(transaction.amount);
                }
            });

            // console.log(income);
            // console.log(spending);
            // console.log(income - spending);

            setBalance(income - spending);
            setIncome(income);
            setSpending(spending);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        }
    }

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    useEffect(() => {
        FindBalance();
    }, []);

    useEffect(() => {
        const fetchNickname = async () => {
          try {
            const response = await api.get("/api/user/profile/");
            // setNickname(response.data.username);

            const createdDate = new Date(response.data.createdDate); 
        
          
            const formattedDate = createdDate.toLocaleDateString('en-GB', { 
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
    
            setAccountCreatedDate(formattedDate);
            setNickname(response.data.first_name);
            setProfilePhoto(response.data.profileImg);
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
                <TopPart nickname={nickname} selectedItem={"overview"} profilePhoto={profilePhoto}/>
                
                <div className="grid-container">

                {/* <div className="SummaryCards-container"> */}
                    <SummaryCard 
                        title={"Total Balance"}
                        date={`${accountCreatedDate} - ${todayDate}`} 
                        amount={currency + formatAmount(Balance.toFixed(2))}
                        trends={"Total balance for period"}
                        style_trends={{color: '#00BCD4'}}
                        img_src={WalletIcon}
                    />
                    <SummaryCard 
                        title={"Total Income"}
                        date={`${accountCreatedDate} - ${todayDate}`} 
                        // amount={currency + "520.000,01"}
                        amount={"+" + currency + formatAmount(Income.toFixed(2))}
                        trends={"Total income for period"}
                        style_trends={{color: '#4CAF50'}}
                        img_src={CardIcon}
                    />
                    <SummaryCard 
                        title={"Total Spending"}
                        date={`${accountCreatedDate} - ${todayDate}`} 
                        // amount={"-" + currency + "228.000,00"}
                        amount={"-" + currency + formatAmount(Spending.toFixed(2))}
                        trends={"Total spending for period"}
                        style_trends={{color: '#F44336'}}
                        img_src={BagIcon}
                    />
                {/* </div> */}
                {/* <div className="trans-graph-container"> */}
                    <Transactions />
                    <BarChart />
                {/* </div> */}
                </div>

            </MainContainer>
        </>
    )
}

export default Home;