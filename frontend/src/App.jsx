import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./Pages/Public/SplashScreen.jsx";
import Landing from "./Pages/Public/Landing.jsx";
import Login from "./Pages/Public/Login.jsx";
import Signup from "./Pages/Public/Signup.jsx";
import Homepage from "./Pages/Public/Homepage.jsx";
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
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Homepage />} />
      </Route>
    </Routes>
  );
}

export default App;





