import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/homepage.css";
import logo from "../../assets/logo.png";
import apiCall from "../../Utils/api";
import { getStoredUser } from "../../Utils/authStorage";
import { clearStoredUser } from "../../Utils/authStorage";

export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState([
    { id: 1, title: "Total Quizzes", value: "0", icon: "📚" },
    { id: 2, title: "Completed", value: "0", icon: "✅" },
    { id: 3, title: "Active Learners", value: "0", icon: "👥" },
    { id: 4, title: "Success Rate", value: "0%", icon: "🏆" },
  ]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomepageData();
    // Also fetch when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchHomepageData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchHomepageData = async () => {
    try {
      // Get user from localStorage
      const user = getStoredUser();
      
      if (!user || !user.id) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }

      setUserName(user.username || user.email?.split("@")[0] || "User");

      // Fetch homepage stats
      const homepageResponse = await apiCall("GET", `/homepage/${user.id}`);
      
      if (homepageResponse.stats) {
        setStats([
          {
            id: 1,
            title: "Total Quizzes",
            value: homepageResponse.stats.totalQuizzes.toString(),
            icon: "📚"
          },
          {
            id: 2,
            title: "Completed",
            value: homepageResponse.stats.completedQuizzes.toString(),
            icon: "✅"
          },
          {
            id: 3,
            title: "Active Learners",
            value: homepageResponse.stats.activeLearners.toString(),
            icon: "👥"
          },
          {
            id: 4,
            title: "Success Rate",
            value: `${homepageResponse.stats.successRate}%`,
            icon: "🏆"
          },
        ]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      setLoading(false);
      // Keep default values on error
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    navigate("/");
  };

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="homepage-navbar">
        <div className="homepage-logo">
          <img src={logo} alt="Logo" />
          
        </div>
        <div className={`homepage-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/" onClick={handleLogout}>Logout</Link>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* Hero Section */}
      <section className="homepage-hero">
        <h1>Welcome Back{userName !== "User" ? `, ${userName}` : ""}!</h1>
        <p>Track your progress and recent activities with Quizzy Bee Homepage.</p>
      </section>

      {/* Stats Cards */}
      <section className="homepage-stats">
        {loading ? (
          <div className="loading-message">Loading your stats...</div>
        ) : (
          stats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <h2>{stat.value}</h2>
              <p>{stat.title}</p>
            </div>
          ))
        )}
      </section>

      {/* Recent Activities */}
      <section className="homepage-activities">
        <h2>Recent Activities</h2>
        <div className="activities-grid">
          {loading ? (
            <div className="activity-card">Loading activities...</div>
          ) : recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="activity-card">
                {activity.activity}
              </div>
            ))
          ) : (
            <div className="activity-card">No recent quiz attempts yet</div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>&copy; 2026 Quizzy Bee. Keep learning! 🐝</p>
      </footer>
    </div>
  );
}
