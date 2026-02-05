// Admin role verification middleware
export const adminOnly = (req, res, next) => {
  const { role } = req.body.user || req.query.user || {};
  
  if (role !== 'admin') {
    return res.status(403).json({ message: "Admin access only" });
  }
  
  next();
};
