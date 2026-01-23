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
      <div className="auth-left">
        <div className="top-logo">
          <img src={logo} alt="Quizzy Logo" />
        </div>

        <div className="glass-card">
          <h2 className="signup-title">Sign Up</h2>

          <form onSubmit={handleSubmit(onSignupClick)}>
            {/* Username */}
            <div className="form-group">
              <input
                {...register("username")}
                placeholder="Username"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "Username")}
              />
              {errors.username && (
                <p className="error-text">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <input
                {...register("email")}
                type="email"
                placeholder="Email Address"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "Email Address")}
              />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

           {/* Password */}
            <div className="form-group password-group">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "Password")}
              />

              <span
                className="eye-toggle"
                onClick={() => setShowPassword(prev => !prev)}
               style={{ cursor: "pointer" }}
       >
        {showPassword ? "👁️" : "🙈"}
  </span>

  {errors.password && (
    <p className="error-text">{errors.password.message}</p>
  )}
</div>

            <button type="submit" className="auth-btn">
              Sign Up
            </button>
          </form>

          <p className="footer-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <img
          src={signupCharacter}
          alt="Quizzy Character"
          className="floating-img"
        />
      </div>
    </div>
  );
}

export default Signup;
