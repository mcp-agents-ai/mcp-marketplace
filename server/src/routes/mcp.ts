import { Router } from 'express';
import { McpServer, refreshCacheIfNeeded, getCleanedServersData } from '../lib/mcpServers.js';

const router = Router();

// GET /servers 
router.get('/servers', async (_req, res) => {
  try {
    const mcpServersCache = await refreshCacheIfNeeded();
    
    // Return cleaned data without hubId
    const cleanedData = getCleanedServersData(mcpServersCache);
    res.json(cleanedData);
    console.log(`v1/mcp/servers Served cached MCP servers data at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Error serving MCP servers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;