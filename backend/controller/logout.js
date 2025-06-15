
import Businessman from "../models/Businessman_Schema.js";

export const checkAuth = async (req, res) => {
  try {
    const user = await Businessman.findById(req.user.id).select("-Password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successful" });
};
