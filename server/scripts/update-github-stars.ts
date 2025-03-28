import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GitHub API 配置
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''; // 从环境变量获取token
const API_DELAY_MS = 2000; // 请求间隔时间（毫秒）
const MAX_RETRIES = 5; // 最大重试次数

// 设置并发数
const CONCURRENCY_LIMIT = 20; // 并发请求数量限制

// 缓存配置
const CACHE_FILE = path.join(__dirname, '..', 'src', 'data', 'github-stars-cache.json');

interface MCP {
  mcpId: string;
  githubUrl: string;
  githubStars: number;
  [key: string]: any;
}

interface StarCache {
  [repoUrl: string]: {
    stars: number;
  };
}

// 延时函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 读取缓存
async function readCache(): Promise<StarCache> {
  try {
    if (!existsSync(CACHE_FILE)) {
      return {};
    }
    const cacheData = await fs.readFile(CACHE_FILE, 'utf8');
    return JSON.parse(cacheData);
  } catch (error) {
    console.warn('读取缓存文件失败，将使用空缓存:', error);
    return {};
  }
}

// 写入缓存
async function writeCache(cache: StarCache): Promise<void> {
  try {
    // 确保目录存在
    const cacheDir = path.dirname(CACHE_FILE);
    if (!existsSync(cacheDir)) {
      await fs.mkdir(cacheDir, { recursive: true });
    }
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.warn('写入缓存文件失败:', error);
  }
}

async function getGithubStars(repoUrl: string, cache: StarCache): Promise<number> {
  // 检查缓存
  if (cache[repoUrl]) {
    // 使用缓存的数据
    return cache[repoUrl].stars;
  }

  let retries = 0;

  while (retries <= MAX_RETRIES) {
    try {
      // 从 URL 中提取 owner 和 repo
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) return 0;

      const [_, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, '').split('#')[0].split('?')[0];

      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
      };

      // 如果有token则添加认证
      if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
      }

      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers });

      if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
        const resetTime = Number(response.headers.get('x-ratelimit-reset')) * 1000;
        const waitTime = Math.max(resetTime - Date.now(), 0);
        console.warn(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
        await delay(waitTime + 1000); // 等待限制重置后再尝试
        retries++;
        continue;
      }

      if (!response.ok) {
        console.warn(`Failed to fetch stars for ${repoUrl}: ${response.statusText}`);
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(`Retrying (${retries}/${MAX_RETRIES})...`);
          await delay(API_DELAY_MS);
          continue;
        }
        return 0;
      }

      const data = await response.json();
      const stars = data.stargazers_count;

      // 更新缓存
      cache[repoUrl] = {
        stars
      };

      return stars;
    } catch (error) {
      console.error(`Error fetching stars for ${repoUrl}:`, error);
      if (retries < MAX_RETRIES) {
        retries++;
        console.log(`Retrying (${retries}/${MAX_RETRIES})...`);
        await delay(API_DELAY_MS);
      } else {
        return 0;
      }
    }
  }

  return 0;
}

async function updateGithubStars(forceRefresh = true) {
  try {
    if (!GITHUB_TOKEN) {
      console.warn('警告: 未设置GITHUB_TOKEN环境变量。这可能导致API请求速率限制。');
    }

    // 读取缓存
    let cache: StarCache = {};
    if (existsSync(CACHE_FILE)) {
      cache = await readCache();
      console.log(`已加载${Object.keys(cache).length}条缓存数据`);
    } else {
      console.log('缓存不存在，将请求API获取数据');
    }

    const filePath = path.join(__dirname, '..', 'src', 'data', 'mcp-servers.json');
    const data = await fs.readFile(filePath, 'utf8');
    const mcps: MCP[] = JSON.parse(data);

    console.log(`正在为${mcps.length}个仓库更新GitHub stars信息...`);

    // 使用并发方式更新每个 MCP 的 GitHub stars
    let updatedCount = 0;
    let cachedCount = 0;

    // 创建队列
    const reposWithGithub = mcps.filter(mcp => mcp.githubUrl);
    
    // 区分需要实时更新和使用缓存的仓库
    const reposToUpdate = forceRefresh 
      ? reposWithGithub 
      : reposWithGithub.filter(mcp => !cache[mcp.githubUrl]);
    
    const reposUseCache = forceRefresh
      ? []
      : reposWithGithub.filter(mcp => cache[mcp.githubUrl]);
    
    // 首先处理缓存数据
    for (const mcp of reposUseCache) {
      const stars = cache[mcp.githubUrl].stars;
      const index = mcps.findIndex(m => m.mcpId === mcp.mcpId);
      if (index !== -1) {
        mcps[index].githubStars = stars;
        cachedCount++;
        console.log(`使用缓存 ${mcp.name || mcp.mcpId}: ${stars} ⭐`);
      }
    }
    
    // 如果有需要更新的数据，进行批处理
    if (reposToUpdate.length > 0) {
      console.log(`需要实时获取 ${reposToUpdate.length} 个仓库的stars数据`);
      
      // 使用批处理方式处理需要更新的仓库列表
      for (let i = 0; i < reposToUpdate.length; i += CONCURRENCY_LIMIT) {
        const batch = reposToUpdate.slice(i, i + CONCURRENCY_LIMIT);
        const batchPromises = batch.map(async (mcp) => {
          // 获取 stars
          const stars = await getGithubStars(mcp.githubUrl, cache);

          // 更新结果
          const index = mcps.findIndex(m => m.mcpId === mcp.mcpId);
          if (index !== -1) {
            mcps[index].githubStars = stars;
            updatedCount++;
            console.log(`实时更新 ${mcp.name || mcp.mcpId}: ${stars} ⭐`);
          }
        });

        // 等待当前批次完成
        await Promise.all(batchPromises);

        // 批次间增加延迟，防止触发GitHub API限制
        await delay(API_DELAY_MS);
      }
    }
    
    // 更新文件
    await fs.writeFile(filePath, JSON.stringify(mcps, null, 4));

    // 更新缓存文件
    await writeCache(cache);

    console.log(`GitHub stars更新成功！从缓存获取: ${cachedCount}, 实时更新: ${updatedCount}`);
  } catch (error) {
    console.error('更新GitHub stars时出错:', error);
    process.exit(1);
  }
}

// 解析命令行参数
const args = process.argv.slice(2);
const forceRefresh = args.includes('--force') || args.includes('-f');

updateGithubStars(forceRefresh); 