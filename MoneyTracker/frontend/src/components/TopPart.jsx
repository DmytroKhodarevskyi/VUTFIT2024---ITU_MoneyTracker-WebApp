import { useState, useEffect } from "react"
import api from "../api"
import "../styles/TopPart.css"
import Logo from "../assets/AppLogo.svg"

function TopPart() {

    const [nickname, setNickname] = useState("")

    useEffect(() => {
        const fetchNickname = async () => {
            try {
                const response = await api.get("/api/user/profile/"); // Adjust the endpoint according to your API
                setNickname(response.data.username); // Adjust the response structure according to your API
            } catch (error) {
                console.error("Failed to fetch nickname", error);
            }
        };

        fetchNickname();
    }, []);


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
                        <li className="navigation-item">
                            <p>Overview</p>
                        </li>
                        <li className="navigation-item">
                            <p>Update</p>
                        </li>
                        <li className="navigation-item">
                            <p>Profile</p>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default TopPart