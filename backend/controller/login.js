import Businessman from "../models/Businessman_Schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginBusinessman = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await Businessman.findOne({ Email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "businessman" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax", // Or "Strict" | "None"
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        Name: user.Name,
        Email: user.Email,
        Businessname: user.Businessname
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
