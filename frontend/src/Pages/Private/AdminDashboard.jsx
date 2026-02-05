import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import "../../css/admin-dashboard-dark.css";

function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("quizzes");
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "medium",
    timeLimit: 300,
    totalQuestions: 10,
    passingScore: 60,
  });
  const navigate = useNavigate();

  // Load all data
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

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, statsRes, userStatsRes] = await Promise.all([
        fetch("http://localhost:5000/api/quizzes/admin/all").then((res) =>
          res.json()
        ),
        fetch("http://localhost:5000/api/quizzes/admin/statistics").then((res) =>
          res.json()
        ),
        fetch("http://localhost:5000/api/quizzes/admin/stats").then((res) =>
          res.json()
        ),
      ]);

      setQuizzes(quizzesRes.quizzes || []);
      setStatistics(statsRes.statistics || []);
      setUserStats(userStatsRes.userStatistics || []);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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
      setShowAddQuiz(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        difficulty: "medium",
        timeLimit: 300,
        totalQuestions: 10,
        passingScore: 60,
      });
      loadData();
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz");
    }
  };

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
      loadData();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz");
    }
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    if (!editingQuiz) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/quizzes/admin/${editingQuiz.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update quiz");

      alert("Quiz updated successfully!");
      setEditingQuiz(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        difficulty: "medium",
        timeLimit: 300,
        totalQuestions: 10,
        passingScore: 60,
      });
      loadData();
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <div className="admin-container">Loading...</div>;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main-content">
        <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <nav className="admin-tabs">
        <button
          className={`tab ${activeTab === "quizzes" ? "active" : ""}`}
          onClick={() => setActiveTab("quizzes")}
        >
          Manage Quizzes
        </button>
        <button
          className={`tab ${activeTab === "statistics" ? "active" : ""}`}
          onClick={() => setActiveTab("statistics")}
        >
          Quiz Statistics
        </button>
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          User Performance
        </button>
      </nav>

      <main className="admin-content">
        {/* Manage Quizzes Tab */}
        {activeTab === "quizzes" && (
          <section className="quizzes-section">
            <div className="section-header">
              <h2>All Quizzes ({quizzes.length})</h2>
              <button
                className="add-btn"
                onClick={() => {
                  setShowAddQuiz(!showAddQuiz);
                  setEditingQuiz(null);
                }}
              >
                {showAddQuiz ? "Cancel" : "+ Add Quiz"}
              </button>
            </div>

            {showAddQuiz && (
              <form className="quiz-form" onSubmit={handleAddQuiz}>
                <h3>Create New Quiz</h3>
                <input
                  type="text"
                  name="title"
                  placeholder="Quiz Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Quiz Description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input
                  type="number"
                  name="totalQuestions"
                  placeholder="Total Questions"
                  value={formData.totalQuestions}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="timeLimit"
                  placeholder="Time Limit (seconds)"
                  value={formData.timeLimit}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="passingScore"
                  placeholder="Passing Score"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                />
                <button type="submit" className="submit-btn">
                  Create Quiz
                </button>
              </form>
            )}

            {editingQuiz && (
              <form className="quiz-form" onSubmit={handleUpdateQuiz}>
                <h3>Edit Quiz: {editingQuiz.title}</h3>
                <input
                  type="text"
                  name="title"
                  placeholder="Quiz Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Quiz Description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input
                  type="number"
                  name="totalQuestions"
                  placeholder="Total Questions"
                  value={formData.totalQuestions}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="timeLimit"
                  placeholder="Time Limit (seconds)"
                  value={formData.timeLimit}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="passingScore"
                  placeholder="Passing Score"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                />
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Update Quiz
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setEditingQuiz(null);
                      setFormData({
                        title: "",
                        description: "",
                        category: "",
                        difficulty: "medium",
                        timeLimit: 300,
                        totalQuestions: 10,
                        passingScore: 60,
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="quizzes-grid">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-card">
                  <h4>{quiz.title}</h4>
                  <p className="category">{quiz.category}</p>
                  <p className="difficulty">Difficulty: {quiz.difficulty}</p>
                  <p className="questions">Questions: {quiz.totalQuestions}</p>
                  <p className="status">
                    {quiz.isActive ? "Active" : "Inactive"}
                  </p>
                  <div className="quiz-actions">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingQuiz(quiz);
                        setFormData({
                          title: quiz.title,
                          description: quiz.description,
                          category: quiz.category,
                          difficulty: quiz.difficulty,
                          timeLimit: quiz.timeLimit,
                          totalQuestions: quiz.totalQuestions,
                          passingScore: quiz.passingScore,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Statistics Tab */}
        {activeTab === "statistics" && (
          <section className="statistics-section">
            <h2>Quiz Statistics</h2>
            <div className="stats-table">
              <table>
                <thead>
                  <tr>
                    <th>Quiz Title</th>
                    <th>Category</th>
                    <th>Total Attempts</th>
                    <th>Unique Users</th>
                    <th>Avg Score</th>
                    <th>Highest Score</th>
                    <th>Pass Rate %</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.map((stat) => (
                    <tr key={stat.id}>
                      <td>{stat.title}</td>
                      <td>{stat.category}</td>
                      <td>{stat.totalAttempts || 0}</td>
                      <td>{stat.uniqueUsers || 0}</td>
                      <td>{parseFloat(stat.averageScore || 0).toFixed(2)}</td>
                      <td>{stat.highestScore || 0}</td>
                      <td>{stat.passPercentage || 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* User Performance Tab */}
        {activeTab === "users" && (
          <section className="users-section">
            <h2>User Quiz Performance</h2>
            <div className="stats-table">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Total Attempts</th>
                    <th>Passed</th>
                    <th>Failed</th>
                    <th>Avg Score</th>
                    <th>Highest Score</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.totalAttempts || 0}</td>
                      <td className="passed">{user.totalPassed || 0}</td>
                      <td className="failed">{user.totalFailed || 0}</td>
                      <td>{parseFloat(user.averageScore || 0).toFixed(2)}</td>
                      <td>{user.highestScore || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
