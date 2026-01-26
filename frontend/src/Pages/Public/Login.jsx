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

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onLoginClick = async (loginData) => {
    console.log("Login form data:", loginData);
    console.log("Remember Me:", rememberMe);
    
    try {
      const response = await apiCall("POST", "/api/auth/login", loginData);
      
      // Save token to localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      
      alert("Login successful!");
      console.log("Server response:", response);
      
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      {/* Top Logo */}
      <div className="top-logo">
        <img src={logo} alt="Logo" />
      </div>
      {/* Left: Character */}
      <div className="loginCharacter-left">
        <img src={loginCharacter} alt="Login Character" className="floating-img" />
      </div>

      {/* Right: Login form */}
      <div className="login-card">
        <h2 className="auth-title">Log in</h2>

        <form onSubmit={handleSubmit(onLoginClick)}>
          <div className="form-group">
            <input
              {...register("email")}
              type="email"
              placeholder="Username"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          <div className="form-group password-group">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={errors.password ? "input-error" : ""}
            />
            <span className="eye-toggle" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
              {showPassword ? "👁️" : "🙈"}
            </span>
            {errors.password && <span className="error">{errors.password.message}</span>}
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
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-btn">Log in</button>
        </form>

        <p className="footer-text">
          or <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
