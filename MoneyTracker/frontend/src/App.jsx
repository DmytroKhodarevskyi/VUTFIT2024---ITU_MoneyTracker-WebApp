import './App.css'
import React from 'react'
import { BrowserRouter, Router,Route, Navigate, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/Profile'
import Update from './pages/Update'
import ProtectedRoute from './components/ProtectedRoute'
import ProfileEdit from './pages/ProfileEdit'
import MyFeed from './pages/MyFeed'
import CreatePost from './pages/CreatePost'

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
        </ProtectedRoute>
      }
      />

      <Route 
        path="/update"
        element={
          <ProtectedRoute>
            <Update />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />}/>
      <Route path="/logout" element={<Logout />}/>
      <Route path="/register" element={<RegisterAndLogout />}/>

      <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      <Route 
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/my-feed"
        element={
          <ProtectedRoute>
            <MyFeed />
          </ProtectedRoute>
        }
      />

      
      <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />


      <Route path="*" element={<NotFound />} />

     </Routes>
    </BrowserRouter>
  )
}

export default App
