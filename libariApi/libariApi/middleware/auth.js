const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwtConfig');

/**
 * authMiddleware(roleRequired)
 * roleRequired:
 *   - 0 → admin
 *   - 1 → user
 *   - undefined → tất cả user được phép
 */
function authMiddleware(roleRequired) {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN
    if (!token) return res.status(401).json({ message: "Không có token" });

    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      if (roleRequired !== undefined && decoded.role !== roleRequired) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  };
}

module.exports = authMiddleware;
