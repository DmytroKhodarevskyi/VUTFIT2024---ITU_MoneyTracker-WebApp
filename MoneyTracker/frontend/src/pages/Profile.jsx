import { useState, useEffect } from "react"
import api from "../api"
import MainContainer from "../components/MainContainer"
import TopPart from "../components/TopPart"
import "../styles/Profile.css"
import ProfileCard from '../components/ProfileCard'
import testImage from './test.jpeg';


function Profile() {
    return (
    <MainContainer>
        <TopPart nickname="denys"/>
        <div className="profile-container">
            <ProfileCard 
            profileImg={testImage}
            fullname="Denys Chernenko"
            jobTitle="Junior"
            email="den@gmail.com"
            phone="+420771230136"
            country="Ukraine"
            city="Kiyv"
            gender="Male"
            totalSpends="1000"
            totalIncome="1000"
            />
        </div>
    </MainContainer>
    )
}

export default Profile