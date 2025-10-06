const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Support token in httpOnly cookie or Authorization header
  let token = req.cookies?.token || "";
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(" ")[0] === "Bearer") {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

module.exports = authMiddleware;
