import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import "../../css/auth.css";
import { LoginSchema } from "./Schema/Login.schema";
import { apiCall } from "../../Utils/api";
import logo from "../../assets/logo.png";
import loginCharacter from "../../assets/loginCharacter.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onLoginClick = async (loginData) => {
    console.log("Login form data:", loginData);

    try {
      // 🔹 SEND EMAIL + PASSWORD (matches backend)
      const response = await apiCall("POST", "/api/auth/login", {
        email: loginData.email,
        password: loginData.password,
      });

      // 🔹 SAVE USER (backend does NOT return token)
      localStorage.setItem("user", JSON.stringify(response.user));

      alert("Login successful!");

      // 🔹 REDIRECT TO HOME
      navigate("/home");
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

        <form onSubmit={handleSubmit(onLoginClick)}>
          {/* EMAIL */}
          <div className="form-group">
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="form-group password-group">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
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
