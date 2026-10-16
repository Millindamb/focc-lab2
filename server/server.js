if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) require("applicationinsights").setup().start();
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/lab2';
const Task = mongoose.model('Task', { title: String, done: { type: Boolean, default: false } });
const Counter = mongoose.model('Counter', { _id: String, n: Number });
mongoose.connect(MONGO_URL).catch(() => process.exit(1));

app.get('/healthz', (_req, res) => res.send('ok'));                                   // liveness
app.get('/readyz', (_req, res) =>                                                     // readiness
  res.sendStatus(mongoose.connection.readyState === 1 ? 200 : 503));

app.get('/api/visits', async (_req, res) => {
  const c = await Counter.findByIdAndUpdate('visits', { $inc: { n: 1 } }, { upsert: true, new: true });
  res.json({ visits: c.n });
});
app.get('/api/tasks', async (_req, res) => res.json(await Task.find().limit(50)));
app.post('/api/tasks', async (req, res) => res.status(201).json(await Task.create({ title: req.body.title })));

app.get('/api/compute', (_req, res) => {                                              // CPU load
  let h = 'x';
  for (let i = 0; i < 20000; i++) h = crypto.createHash('sha256').update(h).digest('hex');
  res.json({ hash: h });
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(3000);