import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/landing.css';

export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      id: 1,
      title: 'Easy Management',
      description: 'Manage your products effortlessly with our intuitive interface.',
      icon: '📦',
    },
    {
      id: 2,
      title: 'Real-time Updates',
      description: 'Get instant notifications and updates on your product activities.',
      icon: '⚡',
    },
    {
      id: 3,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security.',
      icon: '🔒',
    },
    {
      id: 4,
      title: 'Analytics Dashboard',
      description: 'Track performance with detailed analytics and insights.',
      icon: '📊',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Product Manager',
      feedback: 'This platform has transformed how we manage our products. Highly recommended!',
      avatar: '👩‍💼',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Entrepreneur',
      feedback: 'Simple yet powerful. The best solution for our business needs.',
      avatar: '👨‍💼',
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'CEO',
      feedback: 'Excellent customer support and seamless integration with our workflow.',
      avatar: '👩‍💻',
    },
  ];

  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-image">🛍️</span>
            <span>ProductHub</span>
          </div>
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
            <Link to="/login" className="nav-btn login-btn">
              Login
            </Link>
            <Link to="/signup" className="nav-btn signup-btn">
              Sign Up
            </Link>
          </div>
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Manage Your Products with <span className="highlight">Ease</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate platform for product management, analytics, and customer feedback.
            Streamline your workflow and boost productivity.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <button className="btn btn-secondary">Watch Demo</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="illustration">
            📱💼📊
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to succeed in product management</p>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands of satisfied customers</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-avatar">{testimonial.avatar}</div>
              <p className="testimonial-feedback">"{testimonial.feedback}"</p>
              <h4 className="testimonial-name">{testimonial.name}</h4>
              <p className="testimonial-role">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to get started?</h2>
        <p>Join our community and transform your product management today.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-primary">
            Create Free Account
          </Link>
          <a href="#contact" className="btn btn-secondary">
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>ProductHub</h4>
            <p>Your trusted partner in product management.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 ProductHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
