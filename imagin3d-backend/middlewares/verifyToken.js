const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Garante que o token está no formato 'Bearer token'
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Token não fornecido. Acesso negado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: 'Token inválido ou expirado.' });
    }

    req.user = user;
    next(); // Continua para a próxima função na rota
  });
}

module.exports = verifyToken;
