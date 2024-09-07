import { useState, useEffect } from "react"
import api from "../api"
import { Link } from 'react-router-dom';
import "../styles/TopPart.css"
import Logo from "../assets/AppLogo.svg"

function TopPart({nickname, selectedItem}) {

    // const [nickname, setNickname] = useState("")

    // useEffect(() => {
    //     const fetchNickname = async () => {
    //         try {
    //             const response = await api.get("/api/user/profile/"); // Adjust the endpoint according to your API
    //             setNickname(response.data.username); // Adjust the response structure according to your API
    //         } catch (error) {
    //             console.error("Failed to fetch nickname", error);
    //         }
    //     };

    //     fetchNickname();
    // }, []);

    // useEffect(() => {
    //     console.log("TOP PART COMPONENT MOUNTED");
    //     const fetchNickname = async () => {
    //       try {
    //         const response = await api.get("/api/user/profile/");
    //         setNickname(response.data.username);
    //         setIsLoaded(true); // Mark data as loaded
    //       } catch (error) {
    //         console.error("Failed to fetch nickname", error);
    //         setIsLoaded(true); // Even if there’s an error, consider data loaded to prevent infinite loading
    //       }
    //     };
    
    //     fetchNickname();
    //   }, [setIsLoaded]);


    return (
        <>
            <div className="top-container">
                <img className='app-logo' src={Logo} alt="Logo" />


                <div className="home-title-container">
                    <h1 className="home-title">Hello again, {nickname}!</h1>
                    <h2 className="home-subtitle">Here is your brief finances overview, keep track!</h2>
                </div>

                <div className="navigation-container">
                    <ul className="navigation-list">
                        {/* <li className="navigation-item">
                            <Link to ="/">Overview</Link>
                        </li>
                        <li className="navigation-item">
                            <p>Update</p>
                        </li>
                        <li className="navigation-item">
                            <Link to="/profile">Profile</Link>
                        </li> */}
                        <li className={`navigation-item ${selectedItem === 'overview' ? 'navigation-item-selected' : ''}`}>
                        <Link to="/">Overview</Link>
                        </li>
                        <li className={`navigation-item ${selectedItem === 'update' ? 'navigation-item-selected' : ''}`}>
                            <Link to="/update"><p>Update</p></Link>
                        </li>
                        <li className={`navigation-item ${selectedItem === 'profile' ? 'navigation-item-selected' : ''}`}>
                            <Link to="/profile">Profile</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default TopPart