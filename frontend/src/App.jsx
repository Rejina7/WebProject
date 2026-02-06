import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./Pages/Public/SplashScreen.jsx";
import Landing from "./Pages/Public/Landing.jsx";
import Login from "./Pages/Public/Login.jsx";
import Signup from "./Pages/Public/Signup.jsx";
import Homepage from "./Pages/Private/Homepage.jsx";
import Dashboard from "./Pages/Private/Dashboard.jsx";
import Profile from "./Pages/Private/Profile.jsx";
import Quiz from "./Pages/Private/Quiz.jsx";
import CreateQuiz from "./Pages/Private/CreateQuiz.jsx";
import AdminHome from "./Pages/Private/AdminHome.jsx";
import AdminDashboard from "./Pages/Private/AdminDashboard.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";


function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // Optional: auto-hide splash screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplashScreen(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplashScreen) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      {/* Public routes - No authentication required */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* User routes - Authentication required */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/home" element={<PrivateRoute><Homepage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/quiz/:category" element={<PrivateRoute><Quiz /></PrivateRoute>} />
      <Route path="/create-quiz" element={<PrivateRoute><CreateQuiz /></PrivateRoute>} />
      
      {/* Admin routes - Admin role required */}
      <Route path="/admin/home" element={<PrivateRoute requiredRole="admin"><AdminHome /></PrivateRoute>} />
      <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
    </Routes>
  );
}

export default App;





