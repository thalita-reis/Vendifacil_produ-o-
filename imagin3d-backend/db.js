const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.DATABASE_URL) {
  console.error('⚠️  DATABASE_URL não definida no .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

pool.connect()
  .then(() => console.log('🟢 Banco de dados conectado com sucesso'))
  .catch((err) => {
    console.error('🔴 Erro ao conectar no banco de dados:', err);
    process.exit(1);
  });

module.exports = pool;
