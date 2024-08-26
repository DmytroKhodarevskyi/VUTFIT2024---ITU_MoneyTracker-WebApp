import './App.css'
import React from 'react'
import { BrowserRouter, Router,Route, Navigate, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/profile'
import ProtectedRoute from './components/ProtectedRoute'

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
     <Routes>
      
      <Route 
      path="/"
      element={
        <ProtectedRoute>
          <Home />
          <Profile />
        </ProtectedRoute>
      }
      />

      <Route path="/login" element={<Login />}/>
      <Route path="/logout" element={<Logout />}/>
      <Route path="/register" element={<RegisterAndLogout />}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="*" element={<NotFound />}/>

     </Routes>
    </BrowserRouter>
  )
}

export default App
