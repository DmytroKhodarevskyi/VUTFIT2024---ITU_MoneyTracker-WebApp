import { useState, useEffect } from "react"
import {useNavigate } from 'react-router-dom';
import "./Admin.css"
// import { useHistory } from 'react-router-dom';
import api from "../../api"
import MainContainer from "../../components/MainContainer/MainContainer"
import UserList from "./UserList";

import AdminRoute from "./AdminRoute";
// import TopPart from "../../components/TopPart/TopPart";
// import SummaryCard from "../../components/SummaryCard/SummaryCard"
// import WalletIcon from "../../assets/wallet-icon.svg"
// import BagIcon from "../../assets/BagIcon.svg"
// import CardIcon from "../../assets/CardIcon.svg"


// import Transactions from "../../components/Transactions/Transactions"
// import BarChart from "../../components/BarChart/BarChart"


// import ClipLoader from "react-spinners/ClipLoader";

function Admin() {

    const navigate = useNavigate();

    // const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);

     // Get JWT token from local storage or auth provider

    // useEffect(() => {
    //     // Fetch admin data
    //     const fetchData = async () => {
    //         try {
    //             const response = await api.get('/api/custom-admin/', {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    //             setData(response.data);
    //         } catch (error) {
    //             console.error('Error fetching data', error);
    //             if (error.response && error.response.status === 403) {
    //                 // Redirect if not authorized
    //                 // history.push('/not-authorized');
    //                 navigate('/login');
    //             }
    //         }
    //     };
    //     fetchData();
    // }, [token]);

    useEffect(() => {
        const fetchNickname = async () => {
          try {
            // const response = await api.get("/api/custom_admin/check_superuser/");
            // // const response = await api.get("/api/user/profile/");
            // // console.log("Response: ", response.data);

            // if (response.data.is_superuser) {
            //     console.log("Is Admindawdawdawdw: ", response.data.is_superuser);
            //     setIsAdmin(true);
            // } else {
            //     setIsAdmin(false);
            // }

            // console.log("Is Admin: ", isAdmin);
            // // setNickname(response.data.username);
            // setNickname(response.data.first_name);
            // setProfilePhoto(response.data.profileImg);
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

    // if (!isAdmin) {
    //     console.log("NOT ADMIN");
    
    //     navigate('*');
    //     // return (
    //     //     <MainContainer>
    //     //         <div className="error-container">
    //     //             <h1 className="error-text">You are not an admin</h1>
    //     //             <p>Details: You do not have the required permissions to access this page</p>
    //     //             <p>Please check the console for more information.</p>
    //     //         </div>
    //     //     </MainContainer>
    //     // )
    // }

    console.log("IS ADMIN");
    return (
        <>
            <MainContainer>
                {/* <AdminRoute> */}
                <div className="admin-main">
                    <UserList />
                </div>
                {/* </AdminRoute> */}
            </MainContainer>
        </>
    )
}

export default Admin;