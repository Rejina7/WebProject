import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./Pages/Public/SplashScreen.jsx";
import Landing from "./Pages/Public/Landing.jsx";
import Login from "./Pages/Public/Login.jsx";
import Signup from "./Pages/Public/Signup.jsx";
import Homepage from "./Pages/Public/Homepage.jsx";
import Dashboard from "./Pages/Public/Dashboard.jsx";
import Profile from "./Pages/Public/Profile.jsx";
import Quiz from "./Pages/Public/Quiz.jsx";
import CreateQuiz from "./Pages/Public/CreateQuiz.jsx";


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
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/quiz/:category" element={<Quiz />} />
      <Route path="/create-quiz" element={<CreateQuiz />} />
     
    </Routes>
  );
}

export default App;





