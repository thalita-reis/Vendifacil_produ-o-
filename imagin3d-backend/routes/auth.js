const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cadastro
router.post('/register', async (req, res) => {
  const { usuario, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);
  const existe = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
  if (existe.rows.length > 0) return res.status(400).json({ msg: 'Usuário já existe' });

  await pool.query('INSERT INTO usuarios (usuario, senha) VALUES ($1, $2)', [usuario, hash]);
  res.json({ msg: 'Usuário cadastrado com sucesso' });
});

// Login
router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;
  const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);

  if (result.rows.length === 0) return res.status(401).json({ msg: 'Credenciais inválidas' });
  const match = await bcrypt.compare(senha, result.rows[0].senha);
  if (!match) return res.status(401).json({ msg: 'Senha incorreta' });

  const token = jwt.sign({ usuario: result.rows[0].usuario }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = router;
