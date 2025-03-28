import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the interface for an MCP server
export interface McpServer {
  mcpId: string;
  githubUrl?: string;
  name: string;
  author: string;
  description: string;
  codiconIcon?: string;
  logoUrl?: string;
  category?: string;
  tags?: string[];
  requiresApiKey?: boolean;
  isRecommended?: boolean;
  githubStars?: number;
  downloadCount?: number;
  createdAt?: string;
  updatedAt?: string;
  hubId: string;
  [key: string]: string | number | boolean | string[] | undefined;
}

// In-memory cache for MCP servers data
let mcpServersCache: McpServer[] = [];
let lastCacheUpdate: number = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Loads all MCP server data from split files and combines them
 */
export async function loadMcpServersData(): Promise<McpServer[]> {
  try {
    const splitDirPath = join(__dirname, '..', 'data', 'split');
    const files = await fs.readdir(splitDirPath);
    
    const serversData: McpServer[] = [];
    
    // Process each file in the split directory
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = join(splitDirPath, file);
          const fileContent = await fs.readFile(filePath, 'utf8');
          const serverData = JSON.parse(fileContent) as McpServer;
          serversData.push(serverData);
        } catch (fileError) {
          console.error(`Error processing file ${file}:`, fileError);
          // Continue with other files even if one fails
        }
      }
    }
    
    return serversData;
  } catch (error) {
    console.error('Error loading MCP servers data:', error);
    return [];
  }
}

/**
 * Returns a clean version of the MCP servers data with hubId removed
 */
export function getCleanedServersData(serversData: McpServer[]): Omit<McpServer, 'hubId'>[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return serversData.map(({ hubId, ...cleanedServer }) => cleanedServer);
}

/**
 * Refreshes the cache if TTL has expired
 */
export async function refreshCacheIfNeeded(): Promise<McpServer[]> {
  const now = Date.now();
  if (now - lastCacheUpdate > CACHE_TTL || mcpServersCache.length === 0) {
    mcpServersCache = await loadMcpServersData();
    lastCacheUpdate = now;
    console.log(`MCP servers cache refreshed at ${new Date().toISOString()}`);
  }
  return mcpServersCache;
}

// Initialize the cache on startup
refreshCacheIfNeeded().catch(err => {
  console.error('Failed to initialize MCP servers cache:', err);
});