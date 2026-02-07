import { useNavigate } from "react-router-dom";
import "../../css/quiz.css";

export default function CreateQuiz() {
  const navigate = useNavigate();

  return (
    <div className="quiz-container">
      <div className="quiz-complete">
        <h1>Create Your Own Quiz</h1>
        <p style={{ fontSize: "1.1rem", color: "#ccc", margin: "2rem 0" }}>
          This feature is coming soon! 🚀
        </p>
        <p style={{ fontSize: "0.95rem", color: "#999", marginBottom: "2rem" }}>
          You'll be able to create custom quizzes and share them with others.
        </p>
        <button 
          className="restart-btn" 
          onClick={() => navigate("/dashboard")}
          style={{ marginTop: "1rem" }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
