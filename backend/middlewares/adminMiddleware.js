const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  console.log("event " , req.user.role);

  if (req.user.role !== "Organizer" ) {
    return res.status(403).json({
      message: "Organizer access required",
    });
  }

  next();
};

module.exports = adminOnly;