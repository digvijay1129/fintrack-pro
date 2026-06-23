const User = require("../models/User");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await Notification.create({
      title: "New User Registered",
      message: `${name} joined FinTrack`,
      type: "admin",
      isRead: false,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken =
      Math.random()
        .toString(36)
        .substring(2);

    user.resetToken = resetToken;

    user.resetTokenExpiry =
      Date.now() +
      15 * 60 * 1000;

    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const html = `
<h2>FinTrack Password Reset</h2>

<p>Hello ${user.name},</p>

<p>You requested a password reset.</p>

<p>
Click the link below to reset your password:
</p>

<a href="${resetLink}">
Reset Password
</a>

<p>
This link expires in 15 minutes.
</p>

<p>
If you did not request this,
please ignore this email.
</p>
`;

    await sendEmail(
      user.email,
      "FinTrack Password Reset",
      html
    );

    return res.status(200).json({
      message: "User verified",
      token: resetToken,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateCurrency = async (req, res) => {
  try {
    const { currency } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.currency = currency;

    await user.save();

    res.status(200).json({
      message: "Currency updated",
      currency: user.currency,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const resetPassword =
  async (req, res) => {

    try {

      const {
        token,
        password,
      } = req.body;

      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: {
          $gt: Date.now(),
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "Invalid or expired token",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      user.password = hashedPassword;

      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;

      await user.save();

      return res.status(200).json({
        message:
          "Password updated successfully",
      });

    } catch (error) {

      return res.status(500).json({
        message:
          "Server Error",
      });

    }

  };

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateCurrency,
};