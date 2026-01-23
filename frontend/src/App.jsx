import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SplashScreen from "./Pages/Public/SplashScreen.jsx";
import Landing from "./Pages/Public/Landing.jsx";
import Login from "./Pages/Public/Login.jsx";
import Signup from "./Pages/Public/Signup.jsx";

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
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;





