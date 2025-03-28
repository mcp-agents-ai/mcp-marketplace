import { MCPServer } from '../types';

export async function fetchMCPServers(): Promise<MCPServer[]> {
  try {
    const response = await fetch('/v1/hub/servers');
    if (!response.ok) {
      throw new Error('Failed to fetch MCP servers');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching MCP servers:', error);
    return [];
  }
}