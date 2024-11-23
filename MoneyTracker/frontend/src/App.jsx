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
import Register from "./pages/Register/Register";
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
import PublicationDetail from "./pages/PublicationDetail/PublicationDetail";

import UserEdit from "./pages/Admin/UserEdit";
import TransactionsEdit from "./pages/Admin/TransactionsEdit";
import CategoriesEdit from "./pages/Admin/CategoriesEdit";
import AdminGroupsEdit from "./pages/Admin/GroupsEdit";
import AdminPublicationsEdit from "./pages/Admin/PublicationEdit";
import AdminPublicationEditComments from "./pages/Admin/PublicationEditComments";
import TransactionsList from "./pages/TransactionsList/TransactionsList";
import GroupsList from "./pages/GroupsList/GroupsList";
import GroupCreate from "./pages/GroupCreate/GroupCreate";
import GroupView from "./pages/GroupView/GroupView";
import ThreadDetail from "./pages/GroupView/ThreadDetail";
import ThreadRoot from "./pages/GroupView/ThreadRoot";
import GroupEdit from "./pages/GroupEdit/GroupEdit";
import GroupUsers from "./pages/Admin/GroupEditUsers";
import GroupThreads from "./pages/Admin/GroupEditThreads";
import GroupThreadCommentsEdit from "./pages/Admin/GroupThreadCommentsEdit";
import ReminderList from "./pages/Reminders/ReminderList";
import AdminReminderEdit from "./pages/Admin/RemindersEdit"
import CreateNewUser from "./pages/Admin/CreateNewUser";
import UserEditProfile from "./pages/Admin/UserEditProfile"
import CreateNewCategory from "./pages/Admin/CreateNewCategory";
import CreateNewTransaction from "./pages/Admin/CreateNewTransaction";
import CreateNewPublication from "./pages/Admin/CreateNewPublication";
import CreateNewGroup from "./pages/Admin/CreateNewGroup";

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
          path="/profile/reminders"
          element={
            <ProtectedRoute>
              <ReminderList />
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
          path="/custom-admin/user/:pk/data"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserEditProfile />
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
          path="/custom-admin/user/:pk/create-category"
          element={
            <ProtectedRoute>
              <AdminRoute>
                < CreateNewCategory/>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
         <Route
          path="/custom-admin/user/:pk/create-publication"
          element={
            <ProtectedRoute>
              <AdminRoute>
                < CreateNewPublication/>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/custom-admin/user/:pk/create-transaction"
          element={
            <ProtectedRoute>
              <AdminRoute>
                < CreateNewTransaction/>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/custom-admin/user/:pk/create-group"
          element={
            <ProtectedRoute>
              <AdminRoute>
                < CreateNewGroup/>
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
                <AdminPublicationsEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-admin/users/:pk/reminders"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminReminderEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-admin/publications/:pk/comments"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPublicationEditComments />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/custom-admin/users/create"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <CreateNewUser />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-admin/groups/:pk/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <GroupUsers />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-admin/groups/:pk/threads"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <GroupThreads />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-admin/thread/:pk/comments"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <GroupThreadCommentsEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-admin/users/:pk/groups"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminGroupsEdit />
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
          path="/groups"
          element={
            <ProtectedRoute>
              <GroupsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/:groupId"
          element={
            <ProtectedRoute>
              <GroupView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/:groupId/edit"
          element={
            <ProtectedRoute>
              <GroupEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/thread/:threadId"
          element={
            <ProtectedRoute>
              <ThreadDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create_group"
          element={
            <ProtectedRoute>
              <GroupCreate />
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
