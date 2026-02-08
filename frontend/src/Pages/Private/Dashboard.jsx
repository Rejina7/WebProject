import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiCall from "../../Utils/api";
import { clearStoredUser, getStoredUser } from "../../Utils/authStorage";
import "../../css/homepage.css";
import logo from "../../assets/logo.png";
import hero from "../../assets/hero.png";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("User");

  const [userStats, setUserStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    totalPoints: 0,
    streak: 0,
  });

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  
  // Fetch user stats and quizzes on mount
  useEffect(() => {
    fetchUserStats();
    fetchQuizzes();
    const user = getStoredUser();
    if (user) {
      setUserName(user.username || user.email?.split("@")[0] || "User");
    }
    
    // Also fetch when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Dashboard: Tab became visible - refreshing stats");
        fetchUserStats();
        fetchQuizzes();
      }
    };
    
    // Fetch when route changes (on every navigation back)
    const handlePageShow = () => {
      console.log("Dashboard: Page shown - refreshing stats");
      fetchUserStats();
      fetchQuizzes();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await apiCall("GET", "/quizzes");
      console.log("Dashboard: Quizzes fetched:", response.quizzes);
      
      if (response.quizzes) {
        // Transform quizzes to match category card format
        const quizCategories = response.quizzes.map(quiz => ({
          id: quiz.id,
          title: quiz.category,
          icon: getCategoryIcon(quiz.category),
          quizData: quiz
        }));
        setQuizzes(quizCategories);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      "Science": "🔬",
      "IT": "💻",
      "Geography": "🌍",
      "General Knowledge": "❓",
      "Entertainment": "🎬",
      "Stranger Things": "👽",
      "History": "📜",
      "Math": "🔢",
      "Sports": "⚽",
      "Music": "🎵",
      "Art": "🎨",
      "Literature": "📚",
      "Technology": "🖥️",
      "Nature": "🌿",
      "Space": "🚀",
      "Food": "🍔"
    };
    return iconMap[category] || "📝";
  };

  const fetchUserStats = async () => {
    try {
      const user = getStoredUser();
      
      if (!user || !user.id) {
        return;
      }

      console.log("Dashboard: Fetching fresh stats for user", user.id);
      const response = await apiCall("GET", `/quizzes/dashboard/${user.id}`);
      console.log("Dashboard: Fresh stats received:", response.stats);
      
      if (response.stats) {
        setUserStats({
          quizzesCompleted: response.stats.completedQuizzes,
          averageScore: Math.round(response.stats.averageScore),
          totalPoints: response.stats.totalPoints,
          streak: response.stats.currentStreak,
        });
        console.log("Dashboard: Stats updated successfully");
      }

      if (response.recentActivities) {
        setRecentQuizzes(buildRecentQuizzes(response.recentActivities));
      } else {
        setRecentQuizzes([]);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const buildRecentQuizzes = (activities = []) => {
    return activities.slice(0, 3).map((activity, index) => {
      const totalPoints = activity.totalQuestions * 10;
      const percentage = totalPoints ? Math.round((activity.score / totalPoints) * 100) : 0;
      return {
        id: index + 1,
        title: activity.category || activity.title || "Quiz",
        score: percentage,
        date: activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : "",
      };
    });
  };

  const handleLogout = () => {
    clearStoredUser();
    navigate("/");
  };

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await apiCall("GET", "/quizzes/leaderboard");
      if (response.leaderboard) {
        // Map leaderboard to expected format for rendering
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

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  const isSearching = search.trim().length > 0;
  return (
    <div className={`dashboard-container${isSearching ? ' searching-active' : ''}`} style={{ minHeight: '100vh', width: '100%' }}>
      {/* Navbar on right */}
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          <img src={logo} alt="Quizzy Bee Logo" />
        </div>
        <div className="navbar-right">
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search categories."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="navbar-buttons">
            <button className="nav-btn" onClick={() => navigate("/home")}>Home</button>
            <button className="nav-btn" onClick={() => navigate("/profile")}>Profile</button>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Main flex layout: left column (logo, categories, status), right column (hero image) */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
        {/* Left: Logo, Categories, Status */}
        <div className="dashboard-sidebar">
          <div className="categories-container">
            {loading ? (
              <p className="loading-message">Loading quizzes...</p>
            ) : filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((q) => (
                <div key={q.id} className="category-card">
                  <div className="category-icon">{q.icon}</div>
                  <h3>{q.title}</h3>
                  <button className="start-button" onClick={() => navigate(`/quiz/${encodeURIComponent(q.title)}`)}>Start Quiz</button>
                </div>
              ))
            ) : (
              <p className="no-results">No quizzes available.</p>
            )}
          </div>
        {/* Daily Challenge always visible after categories */}
        <section className="daily-challenge">
          <div className="challenge-card">
            <div className="challenge-badge">Daily Challenge</div>
            <h2>🏆 Test Your Knowledge: History Edition</h2>
            <p>Complete today's challenge to earn bonus points!</p>
            <div className="challenge-reward">Reward: +500 points</div>
            <button className="challenge-button">Start Challenge</button>
          </div>
        </section>
        </div>
        {/* Right: Hero image and main content */}
        {!isSearching && (
          <div className="dashboard-main-content">
            <section className="dashboard-hero">
              <img src={hero} alt="Quiz Hero" />
              <div className="hero-greeting">Hello, {userName}</div>
            </section>
            {/* Recent & Leaderboard Section */}
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
                    <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
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
            {/* Your Status at the very end, centered */}
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
          </div>
        )}
      </div>
    </div>
  );
}