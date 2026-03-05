// Submit feedback handler
  async function handleFeedbackSubmit(goToCategories = false) {
    if (!feedbackText.trim()) return;
    setFeedbackSubmitting(true);
    setFeedbackStatus(null);
    try {
      const user = getStoredUser();
      await apiCall("POST", "/feedback", {
        data: {
          userId: user?.id,
          comment: feedbackText.trim(),
          category,
          title: category ? `${category} Quiz` : undefined,
          recipient: "admin",
        },
      });
      setFeedbackStatus({ type: 'success', message: 'Submitted!' });
      setFeedbackText("");
      if (goToCategories) {
        setTimeout(() => navigate('/quiz'), 500);
      }
    } catch (err) {
      setFeedbackStatus({ type: 'error', message: 'Failed to submit feedback.' });
      if (goToCategories) {
        setTimeout(() => navigate('/quiz'), 500);
      }
    }
    setFeedbackSubmitting(false);
  }

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiCall from "../../Utils/api";
import { getStoredUser } from "../../Utils/authStorage";
import "../../css/quiz.css";
import logo from "../../assets/logo.png";

export default function Quiz() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  // Timer state
  const [timer, setTimer] = useState(15); // 15 seconds per question
  const timerRef = useRef();
    // Reset timer on question change
    useEffect(() => {
      if (!questions.length || completed) return;
      setTimer(15);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
      // eslint-disable-next-line
    }, [current, questions.length, completed]);

    // Handle timer running out
    function handleTimeout() {
      setSelected(null);
      setFeedback('⏰');
      setTimeout(() => {
        setFeedback(null);
        if (current < questions.length - 1) setCurrent(c => c + 1);
        else setCompleted(true);
      }, 1200);
    }
  const [feedback, setFeedback] = useState(null); // emoji feedback
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  // For category list
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");

  // Fetch categories for category selection
  useEffect(() => {
    if (!category) {
      setCatLoading(true);
      setCatError("");
      apiCall("GET", "/categories")
        .then((data) => {
          // Remove duplicates by name
          const unique = data.filter((cat, idx, arr) =>
            arr.findIndex(c => (c.name || '').toLowerCase() === (cat.name || '').toLowerCase()) === idx
          );
          setCategories(unique);
        })
        .catch((err) => {
          setCatError("Failed to load categories. " + (err?.message || ""));
        })
        .finally(() => setCatLoading(false));
    }
  }, [category]);

  useEffect(() => {
    // Reset all quiz state when category changes
    setQuestions([]);
    setCurrent(0);
    setScore(0);
    setCompleted(false);
    setSelected(null);
    setFeedback(null);
    setError("");
    setLoading(true);
    if (!category) return;
    async function fetchQuizQuestions() {
      setLoading(true);
      setError("");
      try {
        const categories = await apiCall("GET", "/categories");
        const found = categories.find(c => c.name.toLowerCase() === category.toLowerCase());
        if (!found) {
          setError("Category not found.");
          setLoading(false);
          return;
        }
        const data = await apiCall("GET", `/categories/${found.id}/questions`);
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data.map(q => ({
            question: q.question,
            options: [q.option_a, q.option_b, q.option_c, q.option_d],
            correctIndex: q.correct_option.charCodeAt(0) - 65
          })));
        } else {
          setError("No questions found for this quiz.");
        }
      } catch (err) {
        setError("Failed to load quiz questions. " + (err?.message || ""));
      }
      setLoading(false);
    }
    fetchQuizQuestions();
  }, [category]);

  // Main render logic (after all hooks)
  if (!category) {
    return (
      <div>
        <nav className="quiz-navbar">
          <div className="quiz-navbar-logo">
            <img src={logo} alt="Quizzy Bee Logo" />
            <span style={{fontWeight:700, fontSize:'1.3rem', color:'#FFD600'}}>Quizzy Bee</span>
          </div>
          <div className="quiz-navbar-buttons">
            <button className="nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="nav-btn" onClick={() => navigate('/home')}>Home</button>
          </div>
        </nav>
        <div className="quiz-categories-list enhanced-ui">
          <h2 className="quiz-category-heading">Choose Your Quiz Category</h2>
          {catLoading && <div className="quiz-categories-loading">Loading categories...</div>}
          {catError && <div className="quiz-categories-error">{catError}</div>}
          {!catLoading && !catError && !categories.length && <div className="quiz-categories-empty">No categories available.</div>}
          <div className="categories-container">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => navigate(`/quiz/${encodeURIComponent(cat.name)}`)}
                tabIndex={0}
                role="button"
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/quiz/${encodeURIComponent(cat.name)}`)}
              >
                <div className="quiz-category-icon">📝</div>
                <div className="quiz-category-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ...existing code...


    const handleNext = () => {
      if (selected === questions[current].correctIndex) setScore(score + 1);
      setSelected(null);
      setFeedback(null);
      if (timerRef.current) clearInterval(timerRef.current);
      if (current < questions.length - 1) setCurrent(current + 1);
      else setCompleted(true);
    };

    // Handle answer selection with feedback and sound
    const handleSelect = (idx) => {
      setSelected(idx);
      const isCorrect = idx === questions[current].correctIndex;
      setFeedback(isCorrect ? '🎉' : '❌');
      if (isCorrect && correctSound.current) correctSound.current.play();
      if (!isCorrect && wrongSound.current) wrongSound.current.play();
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => {
        if (isCorrect) {
          setScore(s => s + 1);
        }
        setSelected(null);
        setFeedback(null);
        if (current < questions.length - 1) setCurrent(c => c + 1);
        else {
          setCompleted(true);
          // Submit quiz result to backend
          const user = getStoredUser();
          if (user && user.id) {
            apiCall("POST", "/quizzes/submit", {
              data: {
                userId: user.id,
                category,
                score,
                totalQuestions: questions.length,
                quizTitle: category,
              },
            }).then(() => {
              // Refresh user stats after quiz completion
              apiCall("GET", `/quizzes/dashboard/${user.id}`).then((response) => {
                if (response.stats) {
                  // Optionally, use a global state manager or event to update Dashboard/Profile
                  // For now, store in localStorage for Dashboard/Profile to pick up
                  localStorage.setItem("userStats", JSON.stringify(response.stats));
                }
              });
            }).catch((err) => {
              console.error("Quiz result submission failed:", err);
            });
          }
        }
      }, 1200);
    };





    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!questions.length) return <div>No questions available.</div>;

    return (
      <div className="quiz-container">
        <audio ref={correctSound} src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c3b.mp3" preload="auto" />
        <audio ref={wrongSound} src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c3b.mp3" preload="auto" />
        <button
          className="quiz-title quiz-title-btn"
          style={{ background: 'none', border: 'none', color: '#FFD600', fontSize: '2.3rem', fontWeight: 800, marginBottom: 10, letterSpacing: 1, textAlign: 'center', cursor: 'pointer', outline: 'none', padding: 0 }}
          onClick={() => navigate('/dashboard')}
          title="Go to Dashboard"
        >
          {category} Quiz
        </button>
        {!completed && (
          <>
            <div className="quiz-question-header">
              <span className={timer <= 5 ? "quiz-timer quiz-timer-warning" : "quiz-timer"}>
                ⏰ {timer}s
              </span>
            </div>
            <div className="quiz-question">
              <span className="quiz-question-number">{current + 1}.</span>
              {questions[current]?.question}
            </div>
            <div className="quiz-options">
              {questions[current]?.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`quiz-option${selected === idx ? ' selected' : ''}`}
                  onClick={() => selected === null && handleSelect(idx)}
                  disabled={selected !== null}
                >
                  {option}
                </button>
              ))}
            </div>
            {feedback && (
              <div className="quiz-feedback-emoji">{feedback}</div>
            )}
            <button
              className="quiz-next-btn quiz-exit-btn"
              onClick={() => navigate('/dashboard')}
            >
              Exit
            </button>
          </>
        )}
        {completed && (
          <>
            <div className="quiz-score">Score: {score} / {questions.length}</div>
            <div className="quiz-feedback-form">
              <h3 className="quiz-feedback-title">We value your feedback!</h3>
              <textarea
                className="quiz-feedback-textarea"
                placeholder="Share your thoughts about this quiz..."
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
              />
              <div className="quiz-feedback-btns">
                <button
                  className="quiz-next-btn quiz-feedback-submit"
                  onClick={handleFeedbackSubmit}
                  disabled={feedbackSubmitting || !feedbackText.trim()}
                >
                  {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button
                  className="quiz-next-btn quiz-feedback-dashboard"
                  onClick={() => navigate('/quiz')}
                >
                  Back to Quiz Categories
                </button>
              </div>
              {feedbackStatus && (
                <div className={
                  feedbackStatus.type === 'success'
                    ? 'quiz-feedback-status success'
                    : 'quiz-feedback-status error'
                }>
                  {feedbackStatus.message}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
}