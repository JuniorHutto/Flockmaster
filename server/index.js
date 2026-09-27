import express from 'express';
import pg from 'pg';

// Datasets the frontend is allowed to store (same names as its localStorage keys)
const ALLOWED_KEYS = new Set([
  'flockmaster_data_v1',
  'flockmaster_tasks_v1',
  'herdExpenses',
  'herdRevenues'
]);

const PORT = process.env.PORT || 3000;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const initDb = async () => {
  // Postgres may still be starting; retry for ~60s
  for (let attempt = 1; ; attempt++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_data (
          key        TEXT PRIMARY KEY,
          value      JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      return;
    } catch (err) {
      if (attempt >= 30) throw err;
      console.log(`Waiting for database (${err.message})...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
};

const app = express();
app.use(express.json({ limit: '20mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

// All datasets in one response: { key: value, ... }
app.get('/api/data', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT key, value FROM app_data');
    res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
  } catch (err) {
    next(err);
  }
});

app.put('/api/data/:key', async (req, res, next) => {
  const { key } = req.params;
  if (!ALLOWED_KEYS.has(key)) return res.status(404).json({ error: 'Unknown key' });
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Body must be a JSON array' });
  try {
    await pool.query(
      `INSERT INTO app_data (key, value, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [key, JSON.stringify(req.body)]
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

await initDb();
app.listen(PORT, () => console.log(`FlockMaster API listening on ${PORT}`));
