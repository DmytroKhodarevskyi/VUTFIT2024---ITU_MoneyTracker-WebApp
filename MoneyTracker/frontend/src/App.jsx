import "./App.css";
import React from "react";
import {
  BrowserRouter,
  Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/register";
import Profile from "./pages/Profile/Profile";
import Update from "./pages/Update/Update";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileEdit from "./pages/Profile/ProfileEdit";
import CategoriesAndStatistics from "./pages/CategoryStatistics/CategoriesAndStatistics";
import MyFeed from "./pages/MyFeed/MyFeed";
import Feed from "./pages/Feed/Feed";
import CreatePost from "./pages/CreatePost/CreatePost";
import CustomAdmin from "./pages/Admin/Admin";
import AdminRoute from "./pages/Admin/AdminRoute";
import PublicationDetail from "./pages/PublicationDetail/PublicationDetail"

import UserEdit from "./pages/Admin/UserEdit";
import TransactionsEdit from "./pages/Admin/TransactionsEdit";
import CategoriesEdit from "./pages/Admin/CategoriesEdit";
import TransactionsList from "./pages/TransactionsList/TransactionsList";
function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
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

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <CustomAdmin />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-admin/users/:pk"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-admin/users/:pk/transactions"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <TransactionsEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route 
        path="/transactions-list"
        element={
          <ProtectedRoute>
            <TransactionsList />
          </ProtectedRoute>
        }
        />

        <Route
          path="/custom-admin/users/:pk/categories"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <CategoriesEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-admin/users/:pk/publications"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
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
          path="/categories-statistics"
          element={
            <ProtectedRoute>
              <CategoriesAndStatistics />
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
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/publication_detail/:publicationId"
          element={
            <ProtectedRoute>
              <PublicationDetail />
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

        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/custom=admin" component={Login} /> */}
        {/* Other routes */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
