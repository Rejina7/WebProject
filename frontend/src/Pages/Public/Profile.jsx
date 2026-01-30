import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Get user data from localStorage
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedProfile = localStorage.getItem("userProfile");
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const profileData = storedProfile ? JSON.parse(storedProfile) : {};
        
        return {
          name: userData.username || "User",
          email: userData.email || "user@example.com",
          joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
          bio: profileData.bio || "Quiz enthusiast and knowledge seeker",
          avatar: userData.username?.charAt(0).toUpperCase() || "👤",
          id: userData.id,
        };
      }
      return {
        name: "Guest User",
        email: "guest@example.com",
        joinDate: "January 2024",
        bio: "Quiz enthusiast and knowledge seeker",
        avatar: "👤",
      };
    } catch (error) {
      console.error("Error reading user data:", error);
      return {
        name: "Guest User",
        email: "guest@example.com",
        joinDate: "January 2024",
        bio: "Quiz enthusiast and knowledge seeker",
        avatar: "👤",
      };
    }
  };

  const [userProfile, setUserProfile] = useState(getStoredUser());
  const [editData, setEditData] = useState(userProfile);

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSave = () => {
    setUserProfile(editData);
    // Save updated profile to localStorage
    localStorage.setItem("userProfile", JSON.stringify({
      bio: editData.bio,
      name: editData.name,
      email: editData.email,
    }));
    setIsEditing(false);
  };

  const userStats = {
    quizzesCompleted: 42,
    averageScore: 85,
    totalPoints: 3420,
    streak: 7,
  };

  const achievements = [
    { id: 1, title: "Quiz Master", icon: "🏆", description: "Complete 50 quizzes" },
    { id: 2, title: "Perfect Score", icon: "💯", description: "Score 100% on a quiz" },
    { id: 3, title: "Streak King", icon: "🔥", description: "Maintain 7-day streak" },
    { id: 4, title: "Brain Power", icon: "🧠", description: "Reach 5000 points" },
  ];

  return (
    <div className="profile-container">
      {/* Navbar */}
      <nav className="profile-navbar">
        <div className="navbar-logo">
          <button className="back-btn" onClick={() => navigate("/home")}>←</button>
          <h2>My Profile</h2>
        </div>
        <div className="navbar-actions">
          <button className="logout-button" onClick={() => navigate("/")}>Logout</button>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Profile Header */}
        <section className="profile-header">
          <div className="profile-card">
            <div className="profile-avatar">{userProfile.avatar}</div>

            {!isEditing ? (
              <div className="profile-info">
                <h1>{userProfile.name}</h1>
                <p className="email">{userProfile.email}</p>
                <p className="bio">{userProfile.bio}</p>
                <p className="join-date">Member since {userProfile.joinDate}</p>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setIsEditing(true);
                    setEditData(userProfile);
                  }}
                >
                  ✏️ Edit Profile
                </button>
              </div>
            ) : (
              <div className="profile-edit">
                <div className="edit-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                  />
                </div>
                <div className="edit-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                  />
                </div>
                <div className="edit-field">
                  <label>Bio</label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => handleEditChange("bio", e.target.value)}
                  />
                </div>
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <h2 className="section-title">Your Statistics</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{userStats.quizzesCompleted}</div>
              <div className="stat-label">Quizzes Completed</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{userStats.averageScore}%</div>
              <div className="stat-label">Average Score</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{userStats.totalPoints}</div>
              <div className="stat-label">Total Points</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{userStats.streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="achievements-section">
          <h2 className="section-title">Achievements</h2>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-icon">{achievement.icon}</div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Settings Section */}
        <section className="settings-section">
          <h2 className="section-title">Settings</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Notifications</h3>
                <p>Manage notification preferences</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Dark Mode</h3>
                <p>Enable dark mode theme</p>
              </div>
              <input type="checkbox" />
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Public Profile</h3>
                <p>Make your profile visible to others</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
