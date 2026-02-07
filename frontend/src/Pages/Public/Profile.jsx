import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiCall from "../../Utils/api";
import "../../css/profile.css";
import { clearStoredUser, getStoredUser } from "../../Utils/authStorage";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const formatJoinDate = (createdAt) => {
    if (!createdAt) return "";
    const parsed = new Date(createdAt);
    if (Number.isNaN(parsed.getTime())) return String(createdAt);
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const buildInitialProfile = () => {
    try {
      const storedUser = getStoredUser();
      const storedProfile = localStorage.getItem("userProfile");
      const profileData = storedProfile ? JSON.parse(storedProfile) : {};
      const createdAt = storedUser?.createdAt || storedUser?.created_at;

      if (storedUser) {
        return {
          name: storedUser.username || "User",
          email: storedUser.email || "user@example.com",
          joinDate: formatJoinDate(createdAt),
          bio: profileData.bio || "Quiz enthusiast and knowledge seeker",
          avatar: storedUser.username?.charAt(0).toUpperCase() || "👤",
          id: storedUser.id,
        };
      }

      return {
        name: "Guest User",
        email: "guest@example.com",
        joinDate: "",
        bio: "Quiz enthusiast and knowledge seeker",
        avatar: "👤",
      };
    } catch (error) {
      console.error("Error reading user data:", error);
      return {
        name: "Guest User",
        email: "guest@example.com",
        joinDate: "",
        bio: "Quiz enthusiast and knowledge seeker",
        avatar: "👤",
      };
    }
  };

  const [userProfile, setUserProfile] = useState(buildInitialProfile);
  const [editData, setEditData] = useState(userProfile);
  const [userStats, setUserStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    totalPoints: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: localStorage.getItem("notificationsEnabled") !== "false",
    darkMode: localStorage.getItem("darkModeEnabled") === "true",
    publicProfile: localStorage.getItem("publicProfileEnabled") !== "false",
  });

  // Fetch user profile + stats from backend
  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const storedUser = getStoredUser();
      if (!storedUser || !storedUser.id) {
        return;
      }

      const response = await apiCall("GET", `/auth/profile/${storedUser.id}`);
      const profile = response.user;

      if (profile) {
        const createdAt = profile.createdAt || profile.created_at || storedUser.createdAt || storedUser.created_at;
        const joinDate = formatJoinDate(createdAt) || userProfile.joinDate;

        setUserProfile((prev) => ({
          ...prev,
          id: profile.id,
          name: profile.username || prev.name,
          email: profile.email || prev.email,
          joinDate,
          avatar: (profile.username || prev.name || "U").charAt(0).toUpperCase(),
        }));
        setEditData((prev) => ({
          ...prev,
          name: profile.username || prev.name,
          email: profile.email || prev.email,
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const user = getStoredUser();
      
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      const response = await apiCall("GET", `/quizzes/dashboard/${user.id}`);
      
      if (response.stats) {
        setUserStats({
          quizzesCompleted: response.stats.completedQuizzes,
          averageScore: Math.round(response.stats.averageScore),
          totalPoints: response.stats.totalPoints,
          streak: response.stats.currentStreak,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setLoading(false);
    }
  };

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

  const handleSettingChange = (setting) => {
    const newSettings = { ...settings, [setting]: !settings[setting] };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem(`${setting}Enabled`, newSettings[setting]);
  };
  const achievements = [
    { id: 1, title: "Quiz Master", icon: "🏆", description: "Complete 50 quizzes" },
    { id: 2, title: "Perfect Score", icon: "💯", description: "Score 100% on a quiz" },
    { id: 3, title: "Streak King", icon: "🔥", description: "Maintain 7-day streak" },
    { id: 4, title: "Brain Power", icon: "🧠", description: "Reach 5000 points" },
  ];

  const handleLogout = () => {
    clearStoredUser();
    navigate("/");
  };

  return (
    <div className={`profile-container ${settings.darkMode ? 'dark-mode' : ''}`}>
      {/* Navbar */}
      <nav className="profile-navbar">
        <div className="navbar-logo">
          <button className="back-btn" onClick={() => navigate("/home")}>←</button>
          <h2>My Profile</h2>
        </div>
        <div className="navbar-actions">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
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
                <p className="join-date">
                  Member since {userProfile.joinDate || "Unknown"}
                </p>
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

        {/* Achievements Section - REMOVED */}

        {/* Settings Section */}
        <section className="settings-section">
          <h2 className="section-title">Settings</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Notifications</h3>
                <p>Manage notification preferences</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.notifications}
                onChange={() => handleSettingChange("notifications")}
              />
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Dark Mode</h3>
                <p>Enable dark mode theme</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.darkMode}
                onChange={() => handleSettingChange("darkMode")}
              />
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Public Profile</h3>
                <p>Make your profile visible to others</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.publicProfile}
                onChange={() => handleSettingChange("publicProfile")}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
