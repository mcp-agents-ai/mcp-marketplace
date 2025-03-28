import { Router, Request, Response } from 'express';
import { refreshCacheIfNeeded } from '../lib/mcpServers.js';

const router = Router();

// GET /servers - returns server data with hubId included
router.get('/servers', async (_req: Request, res: Response): Promise<void> => {
  try {
    const mcpServersCache = await refreshCacheIfNeeded();
    
    // Return full data including hubId
    res.json(mcpServersCache);
    console.log(`v1/hub/servers Served full MCP servers data (including hubId) at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Error serving hub MCP servers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /servers/:hubId - returns a specific server by hubId
router.get('/servers/:hubId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { hubId } = req.params;
    const mcpServersCache = await refreshCacheIfNeeded();
    
    // Find the server with the matching hubId
    const server = mcpServersCache.find(server => server.hubId === hubId);
    
    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }
    
    res.json(server);
    console.log(`v1/hub/servers/${hubId} Served server details at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Error serving server details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;