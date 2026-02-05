import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiCall from "../../Utils/api";
import "../../css/homepage.css";
import logo from "../../assets/logo.png";
import hero from "../../assets/hero.png";

export default function Homepage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [userStats, setUserStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    totalPoints: 0,
    streak: 0,
  });

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch user stats and quizzes on mount
  useEffect(() => {
    fetchUserStats();
    fetchQuizzes();
    
    // Also fetch when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Homepage: Tab became visible - refreshing stats");
        fetchUserStats();
        fetchQuizzes();
      }
    };
    
    // Fetch when route changes (on every navigation back)
    const handlePageShow = () => {
      console.log("Homepage: Page shown - refreshing stats");
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
      console.log("Homepage: Quizzes fetched:", response.quizzes);
      
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
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (!user || !user.id) {
        return;
      }

      console.log("Homepage: Fetching fresh stats for user", user.id);
      const response = await apiCall("GET", `/quizzes/dashboard/${user.id}`);
      console.log("Homepage: Fresh stats received:", response.stats);
      
      if (response.stats) {
        setUserStats({
          quizzesCompleted: response.stats.completedQuizzes,
          averageScore: Math.round(response.stats.averageScore),
          totalPoints: response.stats.totalPoints,
          streak: response.stats.currentStreak,
        });
        console.log("Homepage: Stats updated successfully");
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  // Get recent quizzes from localStorage
  const getRecentQuizzes = () => {
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || { quizHistory: [] };
    return quizResults.quizHistory.slice(-3).reverse().map((quiz, index) => ({
      id: index + 1,
      title: quiz.category,
      score: quiz.percentage,
      date: new Date(quiz.date).toLocaleDateString()
    }));
  };

  const recentQuizzes = getRecentQuizzes();

  // Leaderboard
  const leaderboard = [
    { rank: 1, name: "Alex", points: 5280 },
    { rank: 2, name: "Sarah", points: 4950 },
    { rank: 3, name: "Mike", points: 4720 },
  ];

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="homepage-navbar">
        <div className="homepage-logo">
          <img src={logo} alt="Quizzy Bee Logo" />
          
        </div>

        {/* Right side: Buttons + Search */}
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
            <button className="nav-btn" onClick={() => navigate("/profile")}>Profile</button>
            <button className="nav-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button className="logout-button" onClick={() => navigate("/")}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Categories */}
      <section className="homepage-hero">
        {/* Left: Categories */}
        <div className="hero-left">
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
        </div>

        {/* Right: Hero Image */}
        <div className="hero-right">
          <div className="hero-image">
            <img src={hero} alt="Quiz Hero" />
            <button className="hero-create-button" onClick={() => navigate("/create-quiz")}>
              Create Your Own Quiz
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
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

      {/* Daily Challenge */}
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
  );
}
