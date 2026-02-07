import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import "../../css/admin-dashboard-dark.css";
import { getStoredUser } from "../../Utils/authStorage";

function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("quizzes");
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [addingQuestionsQuiz, setAddingQuestionsQuiz] = useState(null);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctIndex: 0 },
  ]);
  const optionLabels = ["A", "B", "C", "D"];
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
    const userData = getStoredUser();
    if (!userData) {
      navigate("/login");
      return;
    }

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

  const handleQuestionChange = (index, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, question: value } : q))
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== questionIndex) return q;
        const nextOptions = q.options.map((opt, idx) =>
          idx === optionIndex ? value : opt
        );
        return { ...q, options: nextOptions };
      })
    );
  };

  const handleCorrectIndexChange = (questionIndex, value) => {
    const parsed = Number(value);
    setQuestions((prev) =>
      prev.map((q, i) => (i === questionIndex ? { ...q, correctIndex: parsed } : q))
    );
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], correctIndex: 0 },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    try {
      const normalizedQuestions = questions
        .map((q) => ({
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()).filter(Boolean),
          correctIndex: q.correctIndex,
        }))
        .filter((q) => q.question && q.options.length >= 2);

      const payload = {
        ...formData,
        totalQuestions:
          normalizedQuestions.length > 0
            ? normalizedQuestions.length
            : formData.totalQuestions,
        questions: normalizedQuestions,
      };

      const response = await fetch("http://localhost:5000/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      setQuestions([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
      loadData();
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz");
    }
  };

  const handleOpenAddQuestions = (quiz) => {
    setAddingQuestionsQuiz(quiz);
    setShowAddQuiz(false);
    setEditingQuiz(null);
    setQuestions([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
  };

  const handleAddQuestionsToQuiz = async (e) => {
    e.preventDefault();
    if (!addingQuestionsQuiz) return;

    try {
      const normalizedQuestions = questions
        .map((q) => ({
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()).filter(Boolean),
          correctIndex: q.correctIndex,
        }))
        .filter((q) => q.question && q.options.length >= 2);

      if (normalizedQuestions.length === 0) {
        alert("Please add at least one valid question.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/quizzes/${addingQuestionsQuiz.id}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: normalizedQuestions }),
        }
      );

      if (!response.ok) throw new Error("Failed to add questions");

      alert("Questions added successfully!");
      setAddingQuestionsQuiz(null);
      setQuestions([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
      loadData();
    } catch (error) {
      console.error("Error adding questions:", error);
      alert("Failed to add questions");
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

  if (loading) return <div className="admin-container">Loading...</div>;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main-content">
        <header className="admin-header">
        <h1>Admin Dashboard</h1>
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
                  setAddingQuestionsQuiz(null);
                }}
              >
                {showAddQuiz ? "Cancel" : "+ Add Quiz"}
              </button>
            </div>

            {showAddQuiz && (
              <form className="quiz-form" onSubmit={handleAddQuiz}>
                <h3>Create New Quiz</h3>
                <label className="form-label" htmlFor="create-title">
                  Quiz Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="create-title"
                  placeholder="Quiz Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <label className="form-label" htmlFor="create-description">
                  Quiz Description
                </label>
                <textarea
                  name="description"
                  id="create-description"
                  placeholder="Quiz Description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <label className="form-label" htmlFor="create-category">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="create-category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
                <label className="form-label" htmlFor="create-difficulty">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  id="create-difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <label className="form-label" htmlFor="create-totalQuestions">
                  Total Questions
                </label>
                <input
                  type="number"
                  name="totalQuestions"
                  id="create-totalQuestions"
                  placeholder="Total Questions (e.g., 10)"
                  value={formData.totalQuestions}
                  onChange={handleInputChange}
                  required
                />
                <label className="form-label" htmlFor="create-timeLimit">
                  Time Limit (seconds)
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  id="create-timeLimit"
                  placeholder="Time Limit in Seconds (e.g., 300)"
                  value={formData.timeLimit}
                  onChange={handleInputChange}
                />
                <label className="form-label" htmlFor="create-passingScore">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  name="passingScore"
                  id="create-passingScore"
                  placeholder="Passing Score % (e.g., 60)"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                />
                <div className="question-builder">
                  <h4>Questions</h4>
                  {questions.map((q, index) => (
                    <div className="question-item" key={`q-${index}`}>
                      <div className="question-item-header">
                        <span>Question {index + 1}</span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleRemoveQuestion(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder={`Question ${index + 1}`}
                        value={q.question}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        required
                      />
                      <div className="question-options">
                        {q.options.map((opt, optIndex) => (
                          <input
                            key={`q-${index}-opt-${optIndex}`}
                            type="text"
                            placeholder={`Option ${optionLabels[optIndex]}`}
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(index, optIndex, e.target.value)
                            }
                            required
                          />
                        ))}
                      </div>
                      <select
                        value={q.correctIndex}
                        onChange={(e) => handleCorrectIndexChange(index, e.target.value)}
                      >
                        {optionLabels.map((label, optIndex) => (
                          <option key={`q-${index}-correct-${label}`} value={optIndex}>
                            Correct: {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-btn"
                    onClick={handleAddQuestion}
                  >
                    + Add Question
                  </button>
                </div>
                <button type="submit" className="submit-btn">
                  Create Quiz
                </button>
              </form>
            )}

            {editingQuiz && (
              <form className="quiz-form" onSubmit={handleUpdateQuiz}>
                <h3>Edit Quiz: {editingQuiz.title}</h3>
                <label className="form-label" htmlFor="edit-title">
                  Quiz Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="edit-title"
                  placeholder="Quiz Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <label className="form-label" htmlFor="edit-description">
                  Quiz Description
                </label>
                <textarea
                  name="description"
                  id="edit-description"
                  placeholder="Quiz Description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <label className="form-label" htmlFor="edit-category">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="edit-category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
                <label className="form-label" htmlFor="edit-difficulty">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  id="edit-difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <label className="form-label" htmlFor="edit-totalQuestions">
                  Total Questions
                </label>
                <input
                  type="number"
                  name="totalQuestions"
                  id="edit-totalQuestions"
                  placeholder="Total Questions (e.g., 10)"
                  value={formData.totalQuestions}
                  onChange={handleInputChange}
                  required
                />
                <label className="form-label" htmlFor="edit-timeLimit">
                  Time Limit (seconds)
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  id="edit-timeLimit"
                  placeholder="Time Limit in Seconds (e.g., 300)"
                  value={formData.timeLimit}
                  onChange={handleInputChange}
                />
                <label className="form-label" htmlFor="edit-passingScore">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  name="passingScore"
                  id="edit-passingScore"
                  placeholder="Passing Score % (e.g., 60)"
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

            {addingQuestionsQuiz && (
              <form className="quiz-form" onSubmit={handleAddQuestionsToQuiz}>
                <h3>Add Questions: {addingQuestionsQuiz.title}</h3>
                <div className="question-builder">
                  <h4>Questions</h4>
                  {questions.map((q, index) => (
                    <div className="question-item" key={`add-q-${index}`}>
                      <div className="question-item-header">
                        <span>Question {index + 1}</span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleRemoveQuestion(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder={`Question ${index + 1}`}
                        value={q.question}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        required
                      />
                      <div className="question-options">
                        {q.options.map((opt, optIndex) => (
                          <input
                            key={`add-q-${index}-opt-${optIndex}`}
                            type="text"
                            placeholder={`Option ${optionLabels[optIndex]}`}
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(index, optIndex, e.target.value)
                            }
                            required
                          />
                        ))}
                      </div>
                      <select
                        value={q.correctIndex}
                        onChange={(e) => handleCorrectIndexChange(index, e.target.value)}
                      >
                        {optionLabels.map((label, optIndex) => (
                          <option key={`add-q-${index}-correct-${label}`} value={optIndex}>
                            Correct: {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-btn"
                    onClick={handleAddQuestion}
                  >
                    + Add Question
                  </button>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Save Questions
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setAddingQuestionsQuiz(null)}
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
                      className="add-questions-btn"
                      onClick={() => handleOpenAddQuestions(quiz)}
                    >
                      Add Questions
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
