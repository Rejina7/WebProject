import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/dashboard.css";
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
    fetchDashboardData();
    
    // Also fetch when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get user from localStorage
      const user = getStoredUser();
      
      if (!user || !user.id) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }

      setUserName(user.username || user.email?.split("@")[0] || "User");

      // Fetch dashboard stats and available quizzes
      const [dashboardResponse, quizzesResponse] = await Promise.all([
        apiCall("GET", `/quizzes/dashboard/${user.id}`),
        apiCall("GET", "/quizzes")
      ]);
      
      if (dashboardResponse.stats) {
        setStats([
          { 
            id: 1, 
            title: "Quizzes Completed", 
            value: dashboardResponse.stats.completedQuizzes.toString(), 
            icon: "📊" 
          },
          { 
            id: 2, 
            title: "Average Score", 
            value: `${Math.round(dashboardResponse.stats.averageScore)}%`, 
            icon: "🎯" 
          },
          { 
            id: 3, 
            title: "Total Points", 
            value: dashboardResponse.stats.totalPoints.toString(), 
            icon: "⭐" 
          },
          { 
            id: 4, 
            title: "Current Streak", 
            value: `${dashboardResponse.stats.currentStreak} days`, 
            icon: "🔥" 
          },
        ]);
      }

      // Show user's recent quiz attempts if they have any, otherwise show available quizzes
      if (dashboardResponse.recentActivities && dashboardResponse.recentActivities.length > 0) {
        const activities = dashboardResponse.recentActivities.map((activity, index) => {
          const status = activity.isPassed ? "✅ Passed" : "❌ Failed";
          const scoreText = `${activity.score}/${activity.totalQuestions * 10}`;
          return {
            id: index + 1,
            activity: `${status} "${activity.title}" - Score: ${scoreText}`,
          };
        });
        setRecentActivities(activities);
      } else if (quizzesResponse.quizzes && quizzesResponse.quizzes.length > 0) {
        // Show available quizzes from homepage if no attempts yet
        const activities = quizzesResponse.quizzes.slice(0, 3).map((quiz, index) => {
          return {
            id: index + 1,
            activity: `Available: "${quiz.title}" - ${quiz.category}`,
          };
        });
        setRecentActivities(activities);
      } else {
        setRecentActivities([
          { id: 1, activity: "No quizzes available at the moment" }
        ]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
      // Keep default values on error
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          <img src={logo} alt="Logo" />
          
        </div>
        <div className={`dashboard-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/home">Home</Link>
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
      <section className="dashboard-hero">
        <h1>Welcome Back{userName !== "User" ? `, ${userName}` : ""}!</h1>
        <p>Track your progress and recent activities with Quizzy Bee Dashboard.</p>
      </section>

      {/* Stats Cards */}
      <section className="dashboard-stats">
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
      <section className="dashboard-activities">
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
            <div className="activity-card">No recent activities</div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2026 Quizzy Bee. Keep learning! 🐝</p>
      </footer>
    </div>
  );
}
