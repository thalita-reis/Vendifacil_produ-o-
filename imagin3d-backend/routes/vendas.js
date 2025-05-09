const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middlewares/verifyToken');

// 🧾 Registrar nova venda (protegida)
router.post('/', verifyToken, async (req, res) => {
  const {
    usuario, descricao, quantidade,
    custo, taxa, frete, gestao,
    precoVenda, lucro, data
  } = req.body;

  try {
    await pool.query(`
      INSERT INTO vendas 
        (usuario, descricao, quantidade, custo, taxa, frete, gestao, precoVenda, lucro, data)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [usuario, descricao, quantidade, custo, taxa, frete, gestao, precoVenda, lucro, data]);

    res.status(201).json({ msg: 'Venda registrada com sucesso' });
  } catch (err) {
    console.error('Erro ao registrar venda:', err);
    res.status(500).json({ msg: 'Erro ao registrar venda' });
  }
});

// 📅 Buscar vendas por intervalo de datas
router.get('/por-data', verifyToken, async (req, res) => {
  const { usuario } = req.user;
  const { inicio, fim } = req.query;

  try {
    const resultado = await pool.query(
      `SELECT * FROM vendas 
       WHERE usuario = $1 AND data BETWEEN $2 AND $3 
       ORDER BY data DESC`,
      [usuario, inicio, fim]
    );

    res.status(200).json(resultado.rows);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar vendas por data' });
  }
});

// 📅 Vendas do mês atual
router.get('/mes-atual', verifyToken, async (req, res) => {
  const { usuario } = req.user;

  const inicio = new Date();
  inicio.setDate(1);
  const fim = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0);

  try {
    const resultado = await pool.query(
      `SELECT * FROM vendas 
       WHERE usuario = $1 AND data BETWEEN $2 AND $3 
       ORDER BY data DESC`,
      [usuario, inicio.toISOString().split('T')[0], fim.toISOString().split('T')[0]]
    );

    res.status(200).json(resultado.rows);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar vendas do mês atual' });
  }
});

// 📅 Vendas do mês passado
router.get('/mes-passado', verifyToken, async (req, res) => {
  const { usuario } = req.user;

  const inicio = new Date();
  inicio.setMonth(inicio.getMonth() - 1);
  inicio.setDate(1);
  const fim = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0);

  try {
    const resultado = await pool.query(
      `SELECT * FROM vendas 
       WHERE usuario = $1 AND data BETWEEN $2 AND $3 
       ORDER BY data DESC`,
      [usuario, inicio.toISOString().split('T')[0], fim.toISOString().split('T')[0]]
    );

    res.status(200).json(resultado.rows);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar vendas do mês passado' });
  }
});

// 📊 Agrupar vendas por mês com total de lucros
router.get('/lucros/mensal', verifyToken, async (req, res) => {
  const { usuario } = req.user;

  try {
    const resultado = await pool.query(
      `SELECT 
         TO_CHAR(data, 'YYYY-MM') AS mes,
         SUM(lucro) AS lucro_total
       FROM vendas
       WHERE usuario = $1
       GROUP BY mes
       ORDER BY mes DESC`,
      [usuario]
    );

    res.status(200).json(resultado.rows);
  } catch (err) {
    console.error('Erro ao buscar lucros mensais:', err);
    res.status(500).json({ msg: 'Erro ao buscar lucros mensais' });
  }
});

module.exports = router;
