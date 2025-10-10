// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider, UserContext } from "./context/userContext";
import { useContext } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import PostJob from "./pages/PostJob";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./components/Profile";
import MyApplications from "./pages/my-applications";
import MyJobs from "./pages/my-jobs";
import AdminDashboard from "./pages/admin-dashboard";

// Composant pour protéger une route (connexion requise)
function PrivateRoute({ children }) {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/login" />;
}

// Composant pour protéger selon le rôle
function RoleRoute({ children, role }) {
  const { user } = useContext(UserContext);
  return user && user.type === role ? children : <Navigate to="/" />;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          {/* Routes protégées par rôle */}
          <Route
            path="/post-job"
            element={
              <RoleRoute role="recruteur">
                <PostJob />
              </RoleRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <RoleRoute role="candidat">
                <MyApplications />
              </RoleRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/admin/dashboard"
            element={
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            }
          /> */}

          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
