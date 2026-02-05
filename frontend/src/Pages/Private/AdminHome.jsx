import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import "../../css/admin-home-dark.css";

function AdminHome() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalCategories: 0,
  });
  const [allUsers, setAllUsers] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "medium",
    timeLimit: 300,
    totalQuestions: 10,
    passingScore: 60,
    isActive: true,
  });

  // Check admin role
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== "admin") {
      navigate("/home");
      return;
    }

    loadQuizzes();
    fetchRecentAttempts();
    fetchTopUsers();
  }, [navigate]);

  // Load all quizzes
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      
      // Fetch quizzes
      const quizzesResponse = await fetch("http://localhost:5000/api/quizzes/admin/all");
      const quizzesData = await quizzesResponse.json();
      
      // Fetch users
      let usersData = { users: [] };
      try {
        const usersResponse = await fetch("http://localhost:5000/api/auth/users");
        if (usersResponse.ok) {
          usersData = await usersResponse.json();
          console.log("📊 Admin Stats - Users Response:", usersData);
          setAllUsers(usersData.users || []);
        } else {
          console.error("❌ Failed to fetch users:", usersResponse.status, usersResponse.statusText);
        }
      } catch (userError) {
        console.error("❌ Error fetching users:", userError);
      }

      if (quizzesData.quizzes) {
        setQuizzes(quizzesData.quizzes);
        // Extract unique categories
        const uniqueCategories = [
          ...new Set(quizzesData.quizzes.map((q) => q.category)),
        ];
        setCategories(uniqueCategories);

        // Calculate stats
        const activeQuizzes = quizzesData.quizzes.filter(q => q.isActive).length;
        const regularUsers = usersData.users?.filter(u => u.role !== 'admin') || [];
        const totalUsers = regularUsers.length;
        
        setStats({
          totalUsers: totalUsers,
          totalQuizzes: quizzesData.quizzes.length,
          activeQuizzes: activeQuizzes,
          totalCategories: uniqueCategories.length,
        });

        console.log("📊 Admin Stats Updated:", {
          totalUsers,
          regularUsers: regularUsers.length,
          totalQuizzes: quizzesData.quizzes.length,
          activeQuizzes,
          totalCategories: uniqueCategories.length
        });
      }
    } catch (error) {
      console.error("❌ Error loading data:", error);
      alert("Failed to load data. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent quiz attempts
  const fetchRecentAttempts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/quizzes/admin/recent-attempts");
      if (response.ok) {
        const data = await response.json();
        setRecentAttempts(data.attempts || []);
      }
    } catch (error) {
      console.error("Error fetching recent attempts:", error);
    }
  };

  // Fetch top users by score
  const fetchTopUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/quizzes/leaderboard");
      if (response.ok) {
        const data = await response.json();
        setTopUsers(data.leaderboard?.slice(0, 10) || []);
      }
    } catch (error) {
      console.error("Error fetching top users:", error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      difficulty: "medium",
      timeLimit: 300,
      totalQuestions: 10,
      passingScore: 60,
      isActive: true,
    });
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingId(null);
  };

  // Add new quiz
  const handleAddQuiz = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create quiz");

      alert("Quiz created successfully!");
      resetForm();
      loadQuizzes();
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz");
    }
  };

  // Edit quiz
  const handleEditClick = (quiz) => {
    setFormData({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      totalQuestions: quiz.totalQuestions,
      passingScore: quiz.passingScore,
      isActive: quiz.isActive,
    });
    setEditingId(quiz.id);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  // Update quiz
  const handleUpdateQuiz = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/quizzes/admin/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update quiz");

      alert("Quiz updated successfully!");
      resetForm();
      loadQuizzes();
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz");
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/quizzes/admin/${quizId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete quiz");

      alert("Quiz deleted successfully!");
      loadQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz");
    }
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || quiz.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="admin-home-container">
        <AdminSidebar />
        <div className="admin-home-content">
          <div className="loading">Loading quizzes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-home-container">
      <AdminSidebar />

      <div className="admin-home-content">
        {/* Header */}
        <header className="admin-home-header">
          <div className="header-stats">
            <div className="stat-card clickable" onClick={() => setShowUsersModal(true)}>
              <div className="stat-icon">👥</div>
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-number">{stats.totalQuizzes}</div>
              <div className="stat-label">Total Quizzes</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-number">{stats.activeQuizzes}</div>
              <div className="stat-label">Active Quizzes</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏷️</div>
              <div className="stat-number">{stats.totalCategories}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
        </header>

        {/* Users Modal */}
        {showUsersModal && (
          <div className="modal-overlay" onClick={() => setShowUsersModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>👥 All Registered Users ({allUsers.filter(u => u.role !== 'admin').length})</h2>
                <button className="modal-close" onClick={() => setShowUsersModal(false)}>×</button>
              </div>
              <div className="modal-body">
                {allUsers.filter(u => u.role !== 'admin').length > 0 ? (
                  <div className="users-list">
                    {allUsers.filter(u => u.role !== 'admin').map((user, index) => (
                      <div key={user.id} className="user-item">
                        <div className="user-number">{index + 1}</div>
                        <div className="user-details">
                          <div className="user-name">{user.username}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                        <div className={`user-role ${user.role}`}>{user.role}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No users found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="admin-controls">
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowEditForm(false);
              if (!showAddForm) resetForm();
            }}
          >
            {showAddForm ? "Cancel" : "+ Add New Quiz"}
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || showEditForm) && (
          <div className="quiz-form-container">
            <h2>{showEditForm ? "Edit Quiz" : "Create New Quiz"}</h2>
            <form
              onSubmit={showEditForm ? handleUpdateQuiz : handleAddQuiz}
              className="quiz-form"
            >
              <div className="form-grid">
                <div className="form-group">
                  <label>Quiz Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter quiz title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., JavaScript, Python"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Total Questions *</label>
                  <input
                    type="number"
                    name="totalQuestions"
                    value={formData.totalQuestions}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time Limit (seconds)</label>
                  <input
                    type="number"
                    name="timeLimit"
                    value={formData.timeLimit}
                    onChange={handleInputChange}
                    min="60"
                  />
                </div>

                <div className="form-group">
                  <label>Passing Score %</label>
                  <input
                    type="number"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    Active Status
                  </label>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter quiz description"
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {showEditForm ? "Update Quiz" : "Create Quiz"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard Sections */}
        <div className="dashboard-sections">
          {/* Recent Quiz Attempts */}
          <div className="dashboard-card">
            <h2>📊 Recent Quiz Attempts</h2>
            <div className="recent-attempts-list">
              {recentAttempts.length > 0 ? (
                recentAttempts.slice(0, 10).map((attempt, index) => (
                  <div key={index} className="attempt-item">
                    <div className="attempt-user">
                      <div className="attempt-avatar">{attempt.username?.charAt(0).toUpperCase()}</div>
                      <div className="attempt-details">
                        <div className="attempt-name">{attempt.username}</div>
                        <div className="attempt-quiz">{attempt.quizTitle}</div>
                      </div>
                    </div>
                    <div className="attempt-score">
                      <div className={`score-badge ${attempt.isPassed ? 'passed' : 'failed'}`}>
                        {attempt.score}%
                      </div>
                      <div className="attempt-status">
                        {attempt.isPassed ? '✅ Passed' : '❌ Failed'}
                      </div>
                    </div>
                    <div className="attempt-time">{new Date(attempt.createdAt).toLocaleDateString()}</div>
                  </div>
                ))
              ) : (
                <div className="no-data">No recent quiz attempts</div>
              )}
            </div>
          </div>

          {/* Top Users by Score */}
          <div className="dashboard-card">
            <h2>🏆 Top Users by Score</h2>
            <div className="leaderboard-list">
              {topUsers.length > 0 ? (
                topUsers.map((user, index) => (
                  <div key={index} className="leaderboard-item">
                    <div className="rank-badge">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className="leaderboard-user">
                      <div className="leaderboard-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                      <div className="leaderboard-details">
                        <div className="leaderboard-name">{user.username}</div>
                        <div className="leaderboard-stats">
                          {user.totalQuizzes} quizzes • {user.averageScore}% avg
                        </div>
                      </div>
                    </div>
                    <div className="leaderboard-points">
                      <div className="points-value">{user.totalPoints}</div>
                      <div className="points-label">points</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No users found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
