import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiCall from "../../Utils/api";
import "../../css/profile.css";
import { clearStoredUser, getStoredUser, updateStoredUser } from "../../Utils/authStorage";

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

  const initialProfile = () => {
    const storedUser = getStoredUser();
    const createdAt = storedUser?.createdAt || storedUser?.created_at;
    return {
      id: storedUser?.id ?? null,
      username: storedUser?.username || "User",
      email: storedUser?.email || "user@example.com",
      role: storedUser?.role || "user",
      createdAt,
      joinDate: formatJoinDate(createdAt),
      avatar: storedUser?.username?.charAt(0).toUpperCase() || "👤",
    };
  };

  const [userProfile, setUserProfile] = useState(initialProfile);
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
      const user = getStoredUser();
      if (!user || !user.id) {
        return;
      }

      const response = await apiCall("GET", `/auth/profile/${user.id}`);
      const profile = response.user;

      if (profile) {
        const storedUser = getStoredUser();
        const createdAt =
          profile.createdAt ||
          profile.created_at ||
          storedUser?.createdAt ||
          storedUser?.created_at;
        const joinDate = formatJoinDate(createdAt) || userProfile.joinDate;

        if (createdAt && !storedUser?.createdAt && !storedUser?.created_at) {
          updateStoredUser({ createdAt });
        }

        const nextProfile = {
          id: profile.id,
          username: profile.username || "User",
          email: profile.email || "user@example.com",
          role: profile.role || "user",
          createdAt,
          joinDate,
          avatar: profile.username?.charAt(0).toUpperCase() || "👤",
        };
        setUserProfile(nextProfile);
        setEditData(nextProfile);
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

  const handleSave = async () => {
    try {
      if (!userProfile.id) {
        return;
      }

      const response = await apiCall("PUT", `/auth/profile/${userProfile.id}`, {
        data: {
          username: editData.username,
          email: editData.email,
        },
      });

      const updated = response.user || {};
      const storedUser = getStoredUser();
      const createdAt =
        updated.createdAt ||
        updated.created_at ||
        storedUser?.createdAt ||
        storedUser?.created_at;
      const joinDate = formatJoinDate(createdAt) || userProfile.joinDate;

      const nextProfile = {
        id: updated.id || userProfile.id,
        username: updated.username || editData.username,
        email: updated.email || editData.email,
        role: updated.role || userProfile.role,
        joinDate,
        avatar: (updated.username || editData.username || "U").charAt(0).toUpperCase(),
      };

      setUserProfile(nextProfile);
      setEditData(nextProfile);
      setIsEditing(false);
    } catch (error) {
      alert(error.message || "Failed to update profile");
    }
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

  const displayJoinDate =
    userProfile.joinDate ||
    formatJoinDate(userProfile.createdAt) ||
    formatJoinDate(getStoredUser()?.createdAt || getStoredUser()?.created_at) ||
    "Unknown";

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
                <h1>{userProfile.username}</h1>
                <p className="email">{userProfile.email}</p>
                <p className="role">Role: {userProfile.role}</p>
                <p className="join-date">Member since {displayJoinDate}</p>
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
                  <label>Username</label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => handleEditChange("username", e.target.value)}
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
