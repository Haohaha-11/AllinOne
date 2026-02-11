import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Frontend server is running' });
});

// Serve static files from dist directory
const distPath = join(__dirname, 'dist');
console.log('Dist path:', distPath);
console.log('Dist exists:', existsSync(distPath));

app.use(express.static(distPath));

// Handle client-side routing - send all requests to index.html
app.get('*', (req, res) => {
  const indexPath = join(__dirname, 'dist', 'index.html');
  console.log('Serving index.html from:', indexPath);
  console.log('Index.html exists:', existsSync(indexPath));
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Health check available at: http://0.0.0.0:${PORT}/health`);
});
