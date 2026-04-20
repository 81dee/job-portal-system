import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // check token exists
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach user id + role

    next(); // go to next route

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};