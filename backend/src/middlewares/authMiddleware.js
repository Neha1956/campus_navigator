import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_super_secret_key_here"
    );

    if (verified.role !== "admin") {
      return res.status(403).json({ message: "Access forbidden. Admins only." });
    }

    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};