exports.requireAdmin = (req, res, next) => {
  const userRole = req.user.role;
  
  // Check if the user is an admin
  if (userRole !== "admin") {
    res.status(403);
    throw new Error("Access denied. You do not have the required role.");
  }

  next();
};

exports.requireManager = (req, res, next) => {
  const userRole = req.user.role;

  // Check if the user is an manger or admin
  if (["admin", "manager"].includes(userRole)) {
    res.status(403);
    throw new Error("Access denied. You do not have the required role.");
  }

  next();
};

exports.requireStaff = (req, res, next) => {
  const userRole = req.user.role;

  // Check if the user is an manger or admin
  if (["admin", "manager", "staff"].includes(userRole)) {
    res.status(403);
    throw new Error("Access denied. You do not have the required role.");
  }

  next();
};