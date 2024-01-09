import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const token = req.cookies?.access_token;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } else {
    res.status(400).json({ errot: "No token found" });
  }
}

export const checkRoles = (roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ error: "Forbidden!" });
  }
};
