const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Generate JWT
const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ===================== SIGNUP ===================== //
exports.signup = async (req, res) => {
  try {
    const {
      name,
      username,
      phone,
      password,
      confirmPassword,
      businessType,
      location,
    } = req.body;

    if (!name || !username || !phone || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { phone }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      phone,
      password: hashedPassword,
      businessType,
      location,
      specialties: [],
      isVerified: false,
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        businessType: user.businessType,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// ===================== LOGIN ===================== //
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        businessType: user.businessType,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ["name", "logoUrl", "location", "specialties"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
