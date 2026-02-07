import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import "../../css/auth.css";
import { LoginSchema } from "./Schema/Login.schema";
import { apiCall } from "../../Utils/api";
import {
  clearRememberedCredentials,
  getRememberedCredentials,
  setRememberedCredentials,
  setStoredUser,
} from "../../Utils/authStorage";
import logo from "../../assets/logo.png";
import loginCharacter from "../../assets/loginCharacter.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const usernameValue = watch("username") || "";

  useEffect(() => {
    // Check if we're coming from a remembered login - don't pre-fill on page load
    // Users must type first to trigger autofill
  }, []);

  useEffect(() => {
    if (usernameValue.length === 0) return;

    // Try to get saved credentials for the username being typed
    const allCredsStr = localStorage.getItem("rememberedCredentials") || "{}";
    let allCreds = {};
    try {
      allCreds = JSON.parse(allCredsStr);
    } catch {
      return;
    }

    // Find a saved username that starts with what user typed
    for (const savedUsername in allCreds) {
      if (savedUsername.toLowerCase().startsWith(usernameValue.toLowerCase())) {
        const savedCreds = allCreds[savedUsername];
        if (savedCreds?.password) {
          setValue("username", savedUsername, { shouldValidate: true });
          setValue("password", savedCreds.password, { shouldValidate: true });
          setRememberMe(true);
          break;
        }
      }
    }
  }, [usernameValue, setValue]);

  const onLoginClick = async (loginData) => {
    console.log("Login form data:", loginData);
    const normalizedUsername = String(loginData.username || "").trim();
    const normalizedPassword = String(loginData.password || "");

    try {
      // 🔹 SEND USERNAME + PASSWORD (matches backend)
      const response = await apiCall("POST", "/auth/login", {
        data: {
          username: normalizedUsername,
          password: normalizedPassword,
        },
      });

      // 🔹 SAVE USER (backend does NOT return token)
      console.log("🔐 Login Response:", response);
      console.log("👤 User data:", response.user);
      setStoredUser(response.user, rememberMe);

      try {
        const profileResponse = await apiCall(
          "GET",
          `/auth/profile/${response.user.id}`
        );
        if (profileResponse?.user) {
          setStoredUser(
            { ...response.user, ...profileResponse.user },
            rememberMe
          );
        }
      } catch (profileError) {
        console.warn("Profile refresh failed:", profileError);
      }
      if (rememberMe) {
        setRememberedCredentials(loginData.username, loginData.password);
      } else {
        clearRememberedCredentials(loginData.username);
      }

      alert("Login successful!");

      // 🔹 REDIRECT BASED ON ROLE (admin or user)
      console.log("🔍 Checking role:", response.user.role);
      if (response.user.role === "admin") {
        console.log("✅ Admin detected! Navigating to /admin/home");
        navigate("/admin/home");
      } else {
        console.log("👤 Regular user detected! Navigating to /home");
        navigate("/home");
      }
    } catch (error) {
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      {/* Top Logo */}
      <div className="top-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Left Character */}
      <div className="loginCharacter-left">
        <img
          src={loginCharacter}
          alt="Login Character"
          className="floating-img"
        />
      </div>

      {/* Right Login Form */}
      <div className="login-card">
        <h2 className="auth-title">Log in</h2>

        <form onSubmit={handleSubmit(onLoginClick)} autoComplete="off">
          {/* USERNAME */}
          <div className="form-group">
            <input
              {...register("username")}
              type="text"
              autoComplete="off"
              placeholder="Username"
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && (
              <span className="error">{errors.username.message}</span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="form-group password-group">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Password"
              className={errors.password ? "input-error" : ""}
            />
            <span
              className="eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? "👁️" : "🙈"}
            </span>
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="auth-btn">
            Log in
          </button>
        </form>

        <p className="footer-text">
          or <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
