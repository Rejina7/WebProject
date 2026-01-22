


import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./Pages/Public/SplashScreen.jsx";
import Home from "./Pages/Public/Home.jsx";
import Login from "./Pages/Public/Login.jsx";
import Signup from "./Pages/Public/Signup.jsx";

function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  return showSplashScreen ? (
    <SplashScreen onFinish={() => setShowSplashScreen(false)} />
  ) : (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

  
export default App;




