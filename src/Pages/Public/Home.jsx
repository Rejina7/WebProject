import { Link } from "react-router-dom";
import "../../css/home.css";
import logo from "../../assets/logo.png";

function Home() {
  return (
    <div className="home-container">
      {/* Floating Logo on Top-Left */}
      <div className="floating-logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link nav-signup">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Buzz into Learning
          </h1>
          <p className="hero-subtitle">
            Master every subject with interactive quizzes, instant feedback, and personalized learning paths
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
            
          </div>
        </div>
        <div className="hero-illustration">
          <div className="floating-bee">🐝</div>
          <div className="quiz-cards">
            <div className="card-1">📚</div>
            <div className="card-2">🎯</div>
            <div className="card-3">⭐</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Quizzy Bee?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Comprehensive Quizzes</h3>
            <p>Test your knowledge with our vast collection of quizzes across multiple subjects and difficulty levels</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Feedback</h3>
            <p>Get immediate results and detailed explanations to understand your mistakes and improve faster</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey with detailed analytics and performance statistics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Personalized Learning</h3>
            <p>Get quiz recommendations tailored to your skill level and learning goals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Leaderboards</h3>
            <p>Compete with friends and climb the global leaderboard to showcase your expertise</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Multi-Subject</h3>
            <p>Explore quizzes in science, math, history, languages, and many more subjects</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat">
          <h3>50K+</h3>
          <p>Active Learners</p>
        </div>
        <div className="stat">
          <h3>1000+</h3>
          <p>Quizzes Available</p>
        </div>
        <div className="stat">
          <h3>95%</h3>
          <p>Success Rate</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Learning?</h2>
        <p>Join thousands of students already improving their knowledge with Quizzy Bee</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-primary btn-large">Create Free Account</Link>
          <Link to="/login" className="btn btn-secondary btn-large">Existing User? Login</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Quizzy Bee. All rights reserved. | Making learning fun, one quiz at a time 🐝</p>
      </footer>
    </div>
  );
}

export default Home;
