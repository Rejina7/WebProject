import hero from "../../assets/hero.png";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/dashboard.css";
import logo from "../../assets/logo.png";
import apiCall from "../../Utils/api";

import { getStoredUser } from "../../Utils/authStorage";
import { clearStoredUser } from "../../Utils/authStorage";

// Logout handler
function handleLogout(navigate) {
  clearStoredUser();
  navigate("/login");
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryQuizzes, setCategoryQuizzes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    totalPoints: 0,
    streak: 0,
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userName, setUserName] = useState("User");

  // Set userName from stored user info on mount
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setUserName(user.username || user.name || user.email?.split("@")[0] || "User");
    }
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiCall("GET", "/categories");
      setCategories(Array.isArray(response) ? response : []);
      console.log('Fetched categories:', response);
    } catch (error) {
      console.error(error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quizzes for a category
  const fetchQuizzesForCategory = async (categoryId) => {
    setLoading(true);
    try {
      // Use correct endpoint for fetching quizzes by category
      const response = await apiCall("GET", `/categories/${categoryId}/questions`);
      console.log("Fetched quizzes for category", categoryId, response);
      setCategoryQuizzes(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching quizzes for category", categoryId, error);
      setCategoryQuizzes([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedCategory) {
      console.log("categoryQuizzes state:", categoryQuizzes);
    }
  }, [categoryQuizzes, selectedCategory]);

  // ✅ Call fetchCategories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const fetchLeaderboard = async () => {
    try {
      const response = await apiCall("GET", "/quizzes/leaderboard");
      if (response.leaderboard) {
        setLeaderboard(
          response.leaderboard.slice(0, 10).map((user, idx) => ({
            rank: idx + 1,
            name: user.username || user.email?.split("@")[0] || "User",
            points: user.totalPoints,
          }))
        );
      } else {
        setLeaderboard([]);
      }
    } catch (error) {
      setLeaderboard([]);
    }
  };

  // Fetch user dashboard stats
  const fetchUserStats = async () => {
    try {
      const user = getStoredUser();
      if (!user || !user.id) return;
      const response = await apiCall("GET", `/dashboard/${user.id}`);
      if (response.stats) {
        setUserStats({
          quizzesCompleted: response.stats.completedQuizzes || 0,
          averageScore: response.stats.successRate || 0,
          totalPoints: response.stats.totalPoints || 0,
          streak: response.stats.currentStreak || 0,
        });
      }
    } catch (error) {
      setUserStats({ quizzesCompleted: 0, averageScore: 0, totalPoints: 0, streak: 0 });
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  // Remove duplicate categories by name (case-insensitive)
  const uniqueCategories = categories.filter((cat, idx, arr) =>
    arr.findIndex(c => (c.name || '').toLowerCase() === (cat.name || '').toLowerCase()) === idx
  );
  const filteredCategories = uniqueCategories.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const isSearching = search.trim().length > 0;

  return (
    <div
      className={`dashboard-container${isSearching ? " searching-active" : ""}`}
      style={{ minHeight: "100vh", width: "100%" }}
    >
      {/* Navbar on right */}
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          <img src={logo} alt="Quizzy Bee Logo" />
        </div>
        <div className="navbar-right">

          <div className="navbar-buttons">
            <button className="nav-btn" onClick={() => navigate("/quiz")}>Categories</button>
            <button className="nav-btn" onClick={() => navigate("/home")}>Home</button>
            <button className="nav-btn" onClick={() => navigate("/profile")}>Profile</button>
            <button className="logout-button" onClick={() => handleLogout(navigate)}>Logout</button>
          </div>
        </div>
      </nav>


      {/* Show quizzes for selected category below navbar */}


      {/* Show quizzes for selected category below the category list */}
      {selectedCategory && (
        <div className="category-quizzes-section">
          <h2 style={{marginTop: 24}}>
            Quizzes for <span style={{color: '#FFD600'}}>{selectedCategory.name}</span>
          </h2>
          {loading ? (
            <p className="loading-message">Loading quizzes...</p>
          ) : (
            <>
              <div className="quizzes-list">
                {categoryQuizzes.length > 0 ? (
                  categoryQuizzes.map((quiz, idx) => (
                    <div key={quiz.id || idx} className="quiz-card">
                      <div className="quiz-question">{quiz.question}</div>
                      <button
                        className="start-button"
                        onClick={() => navigate(`/quiz/${encodeURIComponent(selectedCategory.name)}`)}
                      >
                        Start Quiz
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-results">No quizzes available for this category.</p>
                )}
              </div>
              {/* Debug output for troubleshooting */}
              <div style={{marginTop: 16, color: '#FFD600', background: '#222', padding: 8, borderRadius: 8}}>
                <strong>Debug: categoryQuizzes</strong>
                <pre style={{color: '#FFD600', fontSize: 12, whiteSpace: 'pre-wrap'}}>{JSON.stringify(categoryQuizzes, null, 2)}</pre>
              </div>
            </>
          )}
        </div>
      )}

      {/* Only render main dashboard content if not searching */}
      {!isSearching && (
        <>
          <section className="dashboard-hero">
            <img src={hero} alt="Quiz Hero" />
            <div className="hero-greeting">Hello, {userName}</div>
          </section>

          <section className="info-section">
            {/* Recent Quizzes */}
            <div className="recent-quizzes">
              <h2 className="section-title">Recent Quizzes</h2>
              <div className="recent-list">
                {recentQuizzes.length > 0 ? (
                  recentQuizzes.map((quiz) => (
                    <div key={quiz.id} className="recent-item">
                      <div className="recent-info">
                        <h3>{quiz.title}</h3>
                        <p className="recent-date">{quiz.date}</p>
                      </div>
                      <div className="recent-score">{quiz.score}%</div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>
                    No quizzes attempted yet. Start your first quiz!
                  </p>
                )}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="leaderboard">
              <h2 className="section-title">Top Players</h2>
              <div className="leaderboard-list">
                {leaderboard.map((player) => (
                  <div key={player.rank} className="leaderboard-item">
                    <div className="rank-badge">#{player.rank}</div>
                    <div className="player-name">{player.name}</div>
                    <div className="player-points">{player.points} pts</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="stats-section dashboard-status-center">
            <h2 className="section-title">Your Status</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{userStats.quizzesCompleted}</div>
                <div className="stat-label">Quizzes Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">{userStats.averageScore}%</div>
                <div className="stat-label">Average Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{userStats.totalPoints}</div>
                <div className="stat-label">Total Points</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-value">{userStats.streak} days</div>
                <div className="stat-label">Current Streak</div>
              </div>
            </div>
          </section>

          <section className="daily-challenge" style={{ marginTop: 32 }}>
            <div className="challenge-card">
              <div className="challenge-badge">Daily Challenge</div>
              <h2>🏆 Test Your Knowledge: History Edition</h2>
              <p>Complete today's challenge to earn bonus points!</p>
              <div className="challenge-reward">Reward: +500 points</div>
              <button className="challenge-button">Start Challenge</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
