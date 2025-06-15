// import Businessman from "../models/Businessman_Schema.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const registerBusinessman = async (req, res) => {
//   try {
//     const { Name, Age, Email, PhoneNumber, Businessname, Password } = req.body;

//     const existingBusinessman = await Businessman.findOne({ Email });
//     if (existingBusinessman) {
//       return res.status(400).json({ message: "Email already registered. Please log in." });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(Password, salt);

//     const newBusinessman = await Businessman.create({
//       Name,
//       Age,
//       Email,
//       PhoneNumber,
//       Businessname,
//       Password: hashedPassword
//     });

//     const token = jwt.sign(
//       { id: newBusinessman._id, role: "businessman" },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Set to None only if using HTTPS and cross-domain
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     });

//     res.status(201).json({
//       success: true,
//       message: "Businessman registered successfully",
//       user: {
//         id: newBusinessman._id,
//         Name: newBusinessman.Name,
//         Email: newBusinessman.Email,
//         Businessname: newBusinessman.Businessname
//       }
//     });

//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

import Businessman from "../models/Businessman_Schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerBusinessman = async (req, res) => {
  try {
    const {
      Name,
      Age,
      Email,
      PhoneNumber,
      Businessname,
      Password,
      BankDetails // 🆕 extract bank details
    } = req.body;

    const existingBusinessman = await Businessman.findOne({ Email });
    if (existingBusinessman) {
      return res.status(400).json({ message: "Email already registered. Please log in." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const newBusinessman = await Businessman.create({
      Name,
      Age,
      Email,
      PhoneNumber,
      Businessname,
      Password: hashedPassword,
      BankDetails, // 🆕 save bank details
    });

    const token = jwt.sign(
      { id: newBusinessman._id, role: "businessman" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Businessman registered successfully",
      user: {
        id: newBusinessman._id,
        Name: newBusinessman.Name,
        Email: newBusinessman.Email,
        Businessname: newBusinessman.Businessname
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

