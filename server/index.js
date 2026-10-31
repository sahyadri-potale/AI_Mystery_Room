import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import { connectStore, getCase, saveCase } from './store.js';
import { generateMystery } from './mystery.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.CLIENT_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/cases', async (req, res) => {
  const scenario = typeof req.body?.scenario === 'string' ? req.body.scenario.trim() : '';
  if (scenario.length < 20 || scenario.length > 1200) {
    return res.status(400).json({ error: 'Give us a scenario between 20 and 1,200 characters.' });
  }
  try {
    const generated = await generateMystery(scenario);
    const record = { ...generated, id: randomUUID(), scenario, createdAt: new Date().toISOString() };
    await saveCase(record);
    res.status(201).json(toPublicCase(record));
  } catch (error) {
    console.error('Case generation failed:', error.message);
    res.status(502).json({ error: 'The case could not be assembled. Please try again.' });
  }
});

app.get('/api/cases/:id', async (req, res) => {
  const record = await getCase(req.params.id);
  if (!record) return res.status(404).json({ error: 'Case file not found.' });
  res.json(toPublicCase(record));
});

app.post('/api/cases/:id/submit', async (req, res) => {
  const record = await getCase(req.params.id);
  if (!record) return res.status(404).json({ error: 'Case file not found.' });
  const suspectId = req.body?.suspectId;
  if (!record.suspects.some((suspect) => suspect.id === suspectId)) {
    return res.status(400).json({ error: 'Select one of the listed suspects.' });
  }
  const correct = suspectId === record.culpritId;
  const culprit = record.suspects.find((suspect) => suspect.id === record.culpritId);
  res.json({ correct, culprit: { id: culprit.id, name: culprit.name }, explanation: record.explanation });
});

function toPublicCase(record) {
  const { culpritId: _secret, explanation: _sealed, ...publicRecord } = record;
  return publicRecord;
}

app.listen(port, () => console.log(`Casefile API listening on ${port}`));
connectStore().catch((error) => console.error('Could not connect to case storage; continuing without MongoDB:', error.message));
