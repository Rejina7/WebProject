export const validateSignup = (req, res, next) => {
  const { username, email, password } = req.body;

  // Check required fields
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All fields (username, email, password) are required",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  // Validate username length
  if (username.length < 3) {
    return res.status(400).json({
      message: "Username must be at least 3 characters long",
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      message: "Username must be at least 3 characters long",
    });
  }

  next();
};

export default { validateSignup, validateLogin };
