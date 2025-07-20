const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const designacoesGeralRoute = require('./routes/designacoesGeralRoute');
app.use('/api/designacoes', designacoesGeralRoute);

const designacoesRoutes = require("./routes/designacoesRoutes");
app.use("/api/designacoes", designacoesRoutes);

const participantesRoutes = require("./routes/participantesRoutes");
app.use("/api/participantes", participantesRoutes);

// Rotas (vão sendo separadas depois)
app.get("/", (req, res) => {
  res.send("API de Designações - Vida e Ministério Cristão");
});

// Subir servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Conectar rota
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

console.log("JWT_SECRET:", process.env.JWT_SECRET);
