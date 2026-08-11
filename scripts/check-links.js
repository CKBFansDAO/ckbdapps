const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DAPP_LIST_DIR = path.join(__dirname, '../public/dappList');
const TIMEOUT = 10000; // 10 seconds timeout

// Function to check URL availability
function checkUrl(url) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    const protocol = isHttps ? 'https:' : 'http:';
    
    // Parse URL to get hostname and path
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD',
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };

    const req = client.request(options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        available: res.statusCode >= 200 && res.statusCode < 400
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        available: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        available: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

// Function to read all config.json files
function getAllConfigFiles(dir) {
  const configFiles = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item === 'config.json') {
        configFiles.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return configFiles;
}

// Main function
async function main() {
  console.log('🔍 Checking DApp official links...\n');
  
  const configFiles = getAllConfigFiles(DAPP_LIST_DIR);
  console.log(`Found ${configFiles.length} config files\n`);
  
  const results = [];
  
  for (const configFile of configFiles) {
    try {
      const content = fs.readFileSync(configFile, 'utf8');
      const config = JSON.parse(content);
      
      const projectName = config.project_name || path.basename(path.dirname(configFile));
      const officialLink = config.links?.official;
      
      if (!officialLink || officialLink === '' || officialLink === '""') {
        results.push({
          project: projectName,
          url: officialLink || '(empty)',
          status: 'EMPTY',
          available: false,
          configFile
        });
        continue;
      }
      
      console.log(`Checking: ${projectName} - ${officialLink}`);
      const checkResult = await checkUrl(officialLink);
      
      results.push({
        project: projectName,
        ...checkResult,
        configFile
      });
      
    } catch (error) {
      results.push({
        project: path.basename(path.dirname(configFile)),
        url: '(parse error)',
        status: 'ERROR',
        available: false,
        error: error.message,
        configFile
      });
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY\n');
  
  const unavailable = results.filter(r => !r.available);
  const available = results.filter(r => r.available);
  
  console.log(`✅ Available: ${available.length}`);
  console.log(`❌ Unavailable: ${unavailable.length}`);
  console.log(`📝 Total: ${results.length}\n`);
  
  if (unavailable.length > 0) {
    console.log('❌ UNAVAILABLE LINKS:\n');
    unavailable.forEach((result, index) => {
      console.log(`${index + 1}. ${result.project}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Status: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log(`   Config: ${result.configFile}`);
      console.log();
    });
  }
  
  if (available.length > 0) {
    console.log('✅ AVAILABLE LINKS:\n');
    available.forEach((result) => {
      console.log(`✓ ${result.project} - ${result.url} (${result.status})`);
    });
    console.log();
  }
  
  // Exit with error code if there are unavailable links
  process.exit(unavailable.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
