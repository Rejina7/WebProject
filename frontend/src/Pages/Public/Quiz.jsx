import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiCall from "../../Utils/api";
import "../../css/quiz.css";

const quizData = {
  Science: [
    {
      id: 1,
      question: "What is the chemical symbol for Gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: 2,
    },
    {
      id: 2,
      question: "What is the smallest planet in our solar system?",
      options: ["Venus", "Mercury", "Mars", "Earth"],
      correct: 1,
    },
    {
      id: 3,
      question: "How many bones are in the human body?",
      options: ["186", "206", "226", "246"],
      correct: 1,
    },
    {
      id: 4,
      question: "What is the speed of light?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "100,000 km/s"],
      correct: 0,
    },
    {
      id: 5,
      question: "What gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correct: 2,
    },
    {
      id: 6,
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      correct: 2,
    },
    {
      id: 7,
      question: "How many chambers does the human heart have?",
      options: ["2", "3", "4", "5"],
      correct: 2,
    },
    {
      id: 8,
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
      correct: 2,
    },
    {
      id: 9,
      question: "What planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
    },
    {
      id: 10,
      question: "What is the chemical formula for water?",
      options: ["H2O", "CO2", "O2", "H2O2"],
      correct: 0,
    },
    {
      id: 11,
      question: "How long does it take for light from the Sun to reach Earth?",
      options: ["8 minutes", "8 seconds", "8 hours", "8 days"],
      correct: 0,
    },
    {
      id: 12,
      question: "What is the most abundant element in the universe?",
      options: ["Oxygen", "Carbon", "Hydrogen", "Helium"],
      correct: 2,
    },
    {
      id: 13,
      question: "What force keeps us on the ground?",
      options: ["Magnetism", "Gravity", "Friction", "Inertia"],
      correct: 1,
    },
    {
      id: 14,
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Brain", "Liver", "Skin"],
      correct: 3,
    },
    {
      id: 15,
      question: "What is the boiling point of water at sea level?",
      options: ["90°C", "100°C", "110°C", "120°C"],
      correct: 1,
    },
  ],
  IT: [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
      correct: 0,
    },
    {
      id: 2,
      question: "Which language is known as the language of the web?",
      options: ["Python", "JavaScript", "Java", "C++"],
      correct: 1,
    },
    {
      id: 3,
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      correct: 1,
    },
    {
      id: 4,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      correct: 2,
    },
    {
      id: 5,
      question: "What does API stand for?",
      options: ["Application Programming Interface", "Advanced Programming Interface", "Application Process Interface", "Automated Programming Interface"],
      correct: 0,
    },
    {
      id: 6,
      question: "Which database is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
      correct: 2,
    },
    {
      id: 7,
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
      correct: 0,
    },
    {
      id: 8,
      question: "Which protocol is used for secure web browsing?",
      options: ["HTTP", "FTP", "HTTPS", "SMTP"],
      correct: 2,
    },
    {
      id: 9,
      question: "What is the default port for HTTP?",
      options: ["21", "22", "80", "443"],
      correct: 2,
    },
    {
      id: 10,
      question: "What does RAM stand for?",
      options: ["Random Access Memory", "Read Access Memory", "Rapid Access Memory", "Real Access Memory"],
      correct: 0,
    },
    {
      id: 11,
      question: "Which programming language is known for AI and Machine Learning?",
      options: ["Java", "Python", "C#", "Ruby"],
      correct: 1,
    },
    {
      id: 12,
      question: "What does JSON stand for?",
      options: ["JavaScript Object Notation", "Java Source Object Notation", "JavaScript Oriented Notation", "Java Standard Object Notation"],
      correct: 0,
    },
    {
      id: 13,
      question: "Which company developed JavaScript?",
      options: ["Microsoft", "Netscape", "Google", "Apple"],
      correct: 1,
    },
    {
      id: 14,
      question: "What is the purpose of Git?",
      options: ["Database Management", "Version Control", "Web Hosting", "Code Compilation"],
      correct: 1,
    },
    {
      id: 15,
      question: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Computer Program Unit"],
      correct: 0,
    },
  ],
  Geography: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correct: 1,
    },
    {
      id: 2,
      question: "Which is the longest river in the world?",
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
      correct: 1,
    },
    {
      id: 3,
      question: "What is the largest country by area?",
      options: ["Canada", "Russia", "United States", "China"],
      correct: 1,
    },
    {
      id: 4,
      question: "Which continent is the largest?",
      options: ["Africa", "Europe", "Asia", "North America"],
      correct: 2,
    },
    {
      id: 5,
      question: "What is the smallest country in the world?",
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      correct: 1,
    },
    {
      id: 6,
      question: "Which ocean is the largest?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correct: 3,
    },
    {
      id: 7,
      question: "What is the capital of Japan?",
      options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correct: 2,
    },
    {
      id: 8,
      question: "Which desert is the largest in the world?",
      options: ["Sahara", "Arabian", "Gobi", "Antarctic"],
      correct: 3,
    },
    {
      id: 9,
      question: "What is the tallest mountain in the world?",
      options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
      correct: 1,
    },
    {
      id: 10,
      question: "Which country has the most population?",
      options: ["United States", "Indonesia", "India", "China"],
      correct: 2,
    },
    {
      id: 11,
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      correct: 2,
    },
    {
      id: 12,
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "South Korea", "Japan", "Thailand"],
      correct: 2,
    },
    {
      id: 13,
      question: "What is the largest island in the world?",
      options: ["Madagascar", "Greenland", "New Guinea", "Borneo"],
      correct: 1,
    },
    {
      id: 14,
      question: "Which river flows through Egypt?",
      options: ["Amazon", "Nile", "Tigris", "Euphrates"],
      correct: 1,
    },
    {
      id: 15,
      question: "What is the capital of Canada?",
      options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
      correct: 3,
    },
  ],
};

export default function Quiz() {
  const { category } = useParams();
  const navigate = useNavigate();
  
  // Decode category name and find matching quiz data
  const decodedCategory = decodeURIComponent(category);
  const questions = quizData[decodedCategory] || quizData.Science;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const bgMusicRef = useRef(null);
  const [emojiReaction, setEmojiReaction] = useState(null);

  const question = questions[currentQuestion];

  // Background music - starts when quiz begins
  useEffect(() => {
    const startBackgroundMusic = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.resume();

      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const oscillator3 = audioContext.createOscillator();
      const oscillator4 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      oscillator3.connect(gainNode);
      oscillator4.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Relaxing ambient music - lower, calming frequencies
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      oscillator3.type = 'sine';
      oscillator4.type = 'triangle';
      
      // Pentatonic scale for relaxing sound (C-D-E-G-A)
      oscillator1.frequency.setValueAtTime(130.81, audioContext.currentTime); // C3
      oscillator2.frequency.setValueAtTime(164.81, audioContext.currentTime); // E3
      oscillator3.frequency.setValueAtTime(196.00, audioContext.currentTime); // G3
      oscillator4.frequency.setValueAtTime(220.00, audioContext.currentTime); // A3
      
      gainNode.gain.setValueAtTime(0.03, audioContext.currentTime); // Very soft volume

      oscillator1.start();
      oscillator2.start();
      oscillator3.start();
      oscillator4.start();

      bgMusicRef.current = { oscillator1, oscillator2, oscillator3, oscillator4, gainNode, audioContext };
    };

    startBackgroundMusic();

    return () => {
      if (bgMusicRef.current) {
        try {
          const { oscillator1, oscillator2, oscillator3, oscillator4, gainNode, audioContext } = bgMusicRef.current;
          
          // Fade out the volume
          gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
          
          // Stop oscillators
          setTimeout(() => {
            oscillator1.stop();
            oscillator2.stop();
            oscillator3.stop();
            oscillator4.stop();
          }, 200);
          
          bgMusicRef.current = null;
        } catch (e) {
          console.log('Music cleanup:', e);
        }
      }
    };
  }, []);

  // Sound effects using Web Audio API
  const playSound = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'correct') {
      // Celebration sound - ascending tones
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } else if (type === 'wrong') {
      // Wrong sound - descending tone
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'warning') {
      // Warning sound - beep
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    }
  };

  // Timer effect
  useEffect(() => {
    if (answered || quizComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 15;
        }
        // Play warning sound and show nervous emoji when 3 seconds remain
        if (prev === 4) {
          playSound('warning');
          setEmojiReaction('😰');
          setTimeout(() => setEmojiReaction(null), 1500);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answered, quizComplete]);

  const handleTimeout = () => {
    setAnswered(true);
    setShowWrong(true);
    playSound('wrong');
    setEmojiReaction('😢');
    setTimeout(() => {
      setEmojiReaction(null);
      nextQuestion();
    }, 2000);
  };

  const handleAnswer = (index) => {
    if (answered) return;

    setSelectedOption(index);
    setAnswered(true);

    if (index === question.correct) {
      setScore(score + 1);
      setShowCelebration(true);
      playSound('correct');
      setEmojiReaction('🎉');
      setTimeout(() => {
        setEmojiReaction('😄');
      }, 500);
      setTimeout(() => {
        setEmojiReaction(null);
        nextQuestion();
      }, 2500);
    } else {
      setShowWrong(true);
      playSound('wrong');
      setEmojiReaction('😢');
      setTimeout(() => {
        setEmojiReaction(null);
        nextQuestion();
      }, 2000);
    }
  };

  const nextQuestion = () => {
    setShowCelebration(false);
    setShowWrong(false);
    setSelectedOption(null);
    setTimeLeft(15);
    setAnswered(false);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = async () => {
    try {
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      
      console.log("User from localStorage:", user);
      
      if (user && user.id) {
        // Get quiz ID from database (we need to find the quiz by category)
        const quizzesResponse = await apiCall("GET", "/quizzes");
        const quiz = quizzesResponse.quizzes?.find(q => q.category === decodedCategory);
        
        console.log("Found quiz:", quiz);
        console.log("Quiz category:", decodedCategory);
        
        const percentageScore = Math.round((score / questions.length) * 100);
        const isPassed = percentageScore >= 60; // Assuming 60% is passing score
        
        const submitData = {
          userId: user.id,
          quizId: quiz ? quiz.id : null,
          category: decodedCategory,
          title: `${decodedCategory} Quiz`,
          score: score * 10, // Convert to points (assuming each question is worth 10 points)
          totalQuestions: questions.length,
          correctAnswers: score,
          timeTaken: null,
          isPassed: isPassed
        };
        
        console.log("Submitting quiz result:", submitData);
        
        // Submit quiz result to backend
        const response = await apiCall("POST", "/quizzes/submit", { data: submitData });
        
        console.log("Quiz submission response:", response);
      } else {
        console.error("No user found in localStorage");
      }

      // Data is stored in backend database only, no localStorage backup needed
      
    } catch (error) {
      console.error("Error submitting quiz result:", error);
    } finally {
      // Navigate back - Homepage will fetch fresh data from backend
      navigate("/home");
    }
  };

  if (quizComplete) {
    return (
      <div className="quiz-container">
        <div className="quiz-complete">
          <h1>Quiz Complete! 🎉</h1>
          <div className="final-score">
            <h2>Your Score</h2>
            <div className="score-display">{score}/{questions.length}</div>
            <p className="percentage">{Math.round((score / questions.length) * 100)}%</p>
          </div>
          <button className="restart-btn" onClick={restartQuiz}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Confetti Animation */}
      {showCelebration && <div className="confetti"></div>}
      {showWrong && <div className="wrong-animation"></div>}
      
      {/* Emoji Reactions */}
      {emojiReaction && (
        <div className="emoji-reaction" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '5rem',
          zIndex: 1001
        }}>
          {emojiReaction}
        </div>
      )}

      <div className="quiz-header">
        <h2 
          onClick={() => {
            // Stop music before navigating
            if (bgMusicRef.current) {
              try {
                const { oscillator1, oscillator2, oscillator3, oscillator4, gainNode } = bgMusicRef.current;
                gainNode.gain.setValueAtTime(0, 0);
                oscillator1.stop();
                oscillator2.stop();
                oscillator3.stop();
                oscillator4.stop();
                bgMusicRef.current = null;
              } catch (e) {
                console.log('Stop music:', e);
              }
            }
            navigate("/home");
          }} 
          style={{ cursor: 'pointer' }}
        >
          {decodedCategory} Quiz
        </h2>
        <div className="quiz-progress">
          Question {currentQuestion + 1}/{questions.length}
        </div>
      </div>

      <div className="quiz-content">
        {/* Timer */}
        <div className={`timer ${timeLeft <= 5 ? "warning" : ""}`}>
          <div className="timer-circle">
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Question */}
        <div className="question-box">
          <h3>{question.question}</h3>
        </div>

        {/* Options */}
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                selectedOption === index
                  ? index === question.correct
                    ? "correct"
                    : "incorrect"
                  : ""
              } ${answered && index === question.correct ? "show-correct" : ""}`}
              onClick={() => handleAnswer(index)}
              disabled={answered}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        {/* Score Bar */}
        <div className="score-bar">
          <span>Score: {score}/{questions.length}</span>
        </div>
      </div>
    </div>
  );
}
