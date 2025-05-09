const express = require('express');
const cors = require('cors');
require('dotenv').config();

const verifyToken = require('./middlewares/verifyToken');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas públicas (ex: login e registro)
app.use('/auth', require('./routes/auth'));

// Rotas protegidas
app.use('/vendas', verifyToken, require('./routes/vendas'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
