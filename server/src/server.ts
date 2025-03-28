import express from 'express';
import cors from 'cors';
import mcpRoutes from './routes/mcp.js';
import hubRoutes from './routes/hub.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/mcp', mcpRoutes);
app.use('/v1/hub', hubRoutes);

// Ensure PORT is always a number
const PORT = parseInt(process.env.PORT || '3001', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});