const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuração do pool para conexão com PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '192.168.25.83',
  database: 'db.pessoaJuridica',
  password: 'office',
  port: 5432, // Porta padrão do PostgreSQL
});

app.use(cors());
app.use(express.json());

// Rota para registrar um voto
app.post('/votar', async (req, res) => {
  const { nome, candidato } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO votos (nome, candidato) VALUES ($1, $2) RETURNING *',
      [nome, candidato]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar o voto' });
  }
});

// Rota para zerar votos
app.post('/zerar', async (req, res) => {
  try {
    await pool.query('DELETE FROM votos');
    res.status(200).json({ message: 'Votos zerados com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao zerar os votos' });
  }
});

// Rota para obter resultados
app.get('/resultados', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT candidato, COUNT(*) AS votos FROM votos GROUP BY candidato'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter os resultados' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://192.168.25.83:${port}`);
});