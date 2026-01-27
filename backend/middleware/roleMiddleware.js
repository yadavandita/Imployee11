export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    next();
  };
};

export default roleMiddleware;
