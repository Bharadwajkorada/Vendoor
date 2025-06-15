import jwt from 'jsonwebtoken';

export const verifytoken = (req, res, next) => {
  const token = req.cookies.token; // ✅ fix is here
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // console.log("req")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
