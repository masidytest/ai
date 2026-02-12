import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// --- File System Service (virtual, in-memory for now) ---
const files: Record<string, string> = {};
app.get('/api/files', (req, res) => res.json(Object.keys(files)));
app.get('/api/files/:name', (req, res) => res.json({ content: files[req.params.name] || '' }));
app.post('/api/files/:name', (req, res) => {
  files[req.params.name] = req.body.content || '';
  res.json({ success: true });
});

// --- Code Execution Service (mock/sandboxed) ---
app.post('/api/execute', (req, res) => {
  // For demo: just echo code
  res.json({ output: `Executed: ${req.body.code}` });
});

// --- AI Assistant Endpoints ---
app.post('/api/ai/generate', (req, res) => {
  res.json({ result: `Generated code for: ${req.body.prompt}` });
});
app.post('/api/ai/refactor', (req, res) => {
  res.json({ result: `Refactored code: ${req.body.code}` });
});
app.post('/api/ai/explain', (req, res) => {
  res.json({ result: `Explanation for: ${req.body.code}` });
});

// --- Project Manager Service (mock) ---
app.get('/api/projects', (req, res) => res.json(['demo-project']));

// --- Logging Service (mock) ---
app.post('/api/log', (req, res) => {
  console.log('LOG:', req.body);
  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`AI IDE backend running on port ${PORT}`));
