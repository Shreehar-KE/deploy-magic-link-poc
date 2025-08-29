const express = require("express");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const router = express.Router();

// Invite user (generate magic link)
router.post("/invite", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const token = generateToken();
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, token, tokenExpiry });
    } else {
      user.token = token;
      user.tokenExpiry = tokenExpiry;
    }
    await user.save();

    const magicLink = `${process.env.BASE_URL}/auth/verify?token=${token}`;

    // Instead of sending email, return JSON response
    res.json({ message: "Magic link generated", magicLink });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify magic link
router.get("/verify", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token required" });

    const user = await User.findOne({ token });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    if (user.tokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }

    res.json({ message: "Magic link verified successfully", user: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
