import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto'; // Import randomUUID to generate GUIDs

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const inputFile = path.join(__dirname, 'mcp-servers.json');
const outputDir = path.join(__dirname, 'split');

// Ensure output directory exists
try {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}`);
  }
} catch (err) {
  console.error(`Failed to create directory ${outputDir}:`, err);
  process.exit(1);
}

// Main function
function processJsonFile() {
  try {
    // Read the JSON file content
    const fileContent = fs.readFileSync(inputFile, 'utf8');
    
    // Parse the JSON data
    const servers = JSON.parse(fileContent);
    
    if (!Array.isArray(servers)) {
      throw new Error('Expected JSON content to be an array');
    }
    
    console.log(`Processing ${servers.length} server entries...`);
    
    // Track statistics
    let success = 0;
    let skipped = 0;
    let duplicates = 0;
    
    // Keep track of processed githubUrls
    const processedGithubUrls = new Set();
    
    // Process each server entry
    servers.forEach((server, index) => {
      // Skip entries without a name
      if (!server.name) {
        console.log(`Skipping entry #${index}: No name field`);
        skipped++;
        return;
      }
      
      // Skip entries without a githubUrl
      if (!server.githubUrl) {
        console.log(`Skipping entry #${index}: No githubUrl field`);
        skipped++;
        return;
      }
      
      // Check if this githubUrl has already been processed
      if (processedGithubUrls.has(server.githubUrl)) {
        console.log(`Skipping duplicate entry #${index}: githubUrl already processed - ${server.githubUrl}`);
        duplicates++;
        return;
      }
      
      // Add this githubUrl to the set of processed URLs
      processedGithubUrls.add(server.githubUrl);
      
      // Generate hubId (GUID)
      server.hubId = randomUUID();
      
      // Create a sanitized filename from name (no spaces, special chars)
      const safeName = server.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '')
        .trim();
      
      // Use hubId and sanitized name for the filename
      const filename = `${server.hubId}_${safeName}.json`;
      const outputPath = path.join(outputDir, filename);
      
      // Write to individual file
      fs.writeFileSync(outputPath, JSON.stringify(server, null, 2));
      console.log(`Created: ${filename}`);
      success++;
    });
    
    // Print summary
    console.log(`\nSummary:`);
    console.log(`Total entries: ${servers.length}`);
    console.log(`Successful file creations: ${success}`);
    console.log(`Skipped (no name/githubUrl): ${skipped}`);
    console.log(`Duplicates (same githubUrl): ${duplicates}`);
    console.log(`Unique githubUrls processed: ${processedGithubUrls.size}`);
    console.log(`Files saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Special handling for JSON parse errors
    if (error instanceof SyntaxError) {
      console.error('JSON parsing failed. Check if the file contains valid JSON.');
    }
    
    process.exit(1);
  }
}

// Run the main function
processJsonFile();