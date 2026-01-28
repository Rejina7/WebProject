import { useState } from "react";
import "../../css/homepage.css";
import logo from "../../assets/logo.png";
import hero from "../../assets/hero.png";

export default function Homepage() {
  const [search, setSearch] = useState("");

  const categories = [
    { id: 1, title: "Science", icon: "🔬" },
    { id: 2, title: "IT", icon: "💻" },
    { id: 3, title: "Geography", icon: "🌍" },
    { id: 4, title: "General Knowledge", icon: "❓" },
    { id: 5, title: "Entertainment", icon: "🎬" },
  ];

  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="homepage-navbar">
        <div className="homepage-logo">
          <img src={logo} alt="Quizzy Bee Logo" />
          Quizzy Bee
        </div>

        {/* Right side: Buttons + Search */}
        <div className="navbar-right">
          <div className="navbar-buttons">
            <button className="nav-btn">Profile</button>
            <button className="nav-btn">Dashboard</button>
            <button className="nav-btn">Logout</button>
          </div>
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section with Categories */}
      <section className="homepage-hero">
        {/* Left: Categories */}
        <div className="hero-left">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((c) => (
              <div key={c.id} className="category-card">
                <div className="category-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <button className="start-button">Start Quiz</button>
              </div>
            ))
          ) : (
            <p className="no-results">No categories found.</p>
          )}
        </div>

        {/* Right: Hero Image */}
        <div className="hero-right">
          <div className="hero-image">
            <img src={hero} alt="Quiz Hero" />
          </div>
        </div>
      </section>
    </div>
  );
}
