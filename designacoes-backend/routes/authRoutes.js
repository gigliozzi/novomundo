const express = require("express");
const router = express.Router();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

// Carrega usuários
const USERS_FILE = path.join(__dirname, "../data/users.json");

router.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const rawData = fs.readFileSync(USERS_FILE);
  const users = JSON.parse(rawData);

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ msg: "Usuário não encontrado" });

  const senhaValida = bcrypt.compareSync(senha, user.senha);
  if (!senhaValida) return res.status(401).json({ msg: "Senha incorreta" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
  });
});

module.exports = router;
