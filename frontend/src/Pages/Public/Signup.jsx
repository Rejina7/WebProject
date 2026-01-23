import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import "../../css/signup.css";
import { SignupSchema } from "./Schema/Signup.schema";

import logo from "../../assets/logo.png";
import signupCharacter from "../../assets/signupCharacter.png";
import { apiCall } from "../../Utils/api";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSignupClick = async (signupData) => {
    console.log("sign up button clicked ");
    try {
      const response = await apiCall("POST", "/api/auth/signup", signupData);

      alert("Signup successful!");
      console.log("Server response:", response);

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      {/* Top-right logo */}
      <div className="top-logo">
        <img src={logo} alt="Quizzy Bee" />
      </div>

      {/* Left card */}
      <div className="auth-left">
        <div className="glass-card">
          <h2 className="auth-title">Sign up</h2>

          <form onSubmit={handleSubmit(onSignupClick)}>
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input id="username" {...register("username")} />
              {errors.username && (
                <p className="error-text">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" className="auth-btn">Sign up</button>
          </form>

          <p className="footer-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right illustration */}
      <div className="auth-right">
        <img src={signupCharacter} alt="Character" className="floating-img" />
      </div>
    </div>
  );
}

export default Signup;
