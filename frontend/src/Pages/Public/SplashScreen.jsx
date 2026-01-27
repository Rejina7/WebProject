import { useEffect } from "react";
import logo from "../../assets/logo.png";
import "../../css/splashscreen.css";

function SplashScreen({ onFinish = () => {} }) {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-container">
      <img src={logo} alt="Quizzy Logo" className="splash-logo" />
     
    </div>
  );
}

export default SplashScreen;
