const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = signToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: { username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out" });
};

const me = async (req, res) => {
  try {
    // Try to extract token from cookie or Authorization header
    let token = req.cookies?.token || "";
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.split(" ")[0] === "Bearer") {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(200).json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) return res.status(200).json({ user: null });
    return res.status(200).json({ user });
  } catch (err) {
    // If token invalid or expired, respond with user: null (200) to avoid 401 noise
    return res.status(200).json({ user: null });
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
};
