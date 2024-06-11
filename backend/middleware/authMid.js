const jwt = require('jsonwebtoken');

// JWT 검증 미들웨어
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // 토큰이 없으면 인증 실패

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // 토큰이 유효하지 않으면 접근 거부
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;

