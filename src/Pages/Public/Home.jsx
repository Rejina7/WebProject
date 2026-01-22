import { Link } from "react-router-dom";
import "../../css/home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Quizzy Bee</h1>
      <div className="home-buttons">
        <Link to="/login" className="home-btn">Login</Link>
        <Link to="/signup" className="home-btn">Sign Up</Link>
      </div>
    </div>
  );
}

export default Home;
