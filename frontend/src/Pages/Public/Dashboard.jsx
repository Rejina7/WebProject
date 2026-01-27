import { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/dashboard.css";
import logo from "../../assets/logo.png";

export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const stats = [
    { id: 1, title: "Total Quizzes", value: "120", icon: "📚" },
    { id: 2, title: "Completed", value: "85", icon: "✅" },
    { id: 3, title: "Active Learners", value: "5,000+", icon: "👥" },
    { id: 4, title: "Success Rate", value: "92%", icon: "🏆" },
  ];

  const recentActivities = [
    { id: 1, activity: "Completed 'Math Basics' quiz" },
    { id: 2, activity: "Started 'Science Explorer' quiz" },
    { id: 3, activity: "Achieved new high score in 'History Quiz'" },
  ];

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
          <Link to="/logout">Logout</Link>
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
        <h1>Welcome Back!</h1>
        <p>Track your progress and recent activities with Quizzy Bee Dashboard.</p>
      </section>

      {/* Stats Cards */}
      <section className="dashboard-stats">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <h2>{stat.value}</h2>
            <p>{stat.title}</p>
          </div>
        ))}
      </section>

      {/* Recent Activities */}
      <section className="dashboard-activities">
        <h2>Recent Activities</h2>
        <div className="activities-grid">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-card">
              {activity.activity}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2026 Quizzy Bee. Keep learning! 🐝</p>
      </footer>
    </div>
  );
}
