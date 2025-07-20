const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Token inválido ou expirado" });
  }
}

function verificarAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Acesso restrito a administradores" });
  }
  next();
}

module.exports = { verificarToken, verificarAdmin };
