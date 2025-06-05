#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// デバッグログ関数
function debugLog(message) {
  console.error(`[MCP Shell] ${new Date().toISOString()}: ${message}`);
}

debugLog('MCP Shell Server starting...');

// MCP protocol implementation
const server = {
  name: "shell-executor",
  version: "1.0.0"
};

let requestId = 0;

// リクエスト処理
async function handleRequest(request) {
  debugLog(`Processing request: ${request.method} (ID: ${request.id})`);
  
  try {
    if (request.method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: server
        }
      };
      
    } else if (request.method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          tools: [
            {
              name: "shell",
              description: "Execute shell commands safely",
              inputSchema: {
                type: "object",
                properties: {
                  command: {
                    type: "string",
                    description: "Shell command to execute"
                  }
                },
                required: ["command"]
              }
            }
          ]
        }
      };
      
    } else if (request.method === 'tools/call') {
      if (request.params.name === 'shell') {
        const command = request.params.arguments.command;
        debugLog(`Executing command: ${command}`);
        
        try {
          const result = await execAsync(command, {
            cwd: '/Users/kentanonaka/workmorph/time-bid',
            timeout: 30000,
            maxBuffer: 1024 * 1024,
            encoding: 'utf8'
          });
          
          debugLog(`Command completed successfully`);
          
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              content: [
                {
                  type: "text",
                  text: `Command: ${command}\n\n✅ Output:\n${result.stdout}${result.stderr ? `\n\n⚠️ Stderr:\n${result.stderr}` : ''}`
                }
              ]
            }
          };
          
        } catch (error) {
          debugLog(`Command failed: ${error.message}`);
          
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              content: [
                {
                  type: "text",
                  text: `❌ Command failed: ${command}\n\nError: ${error.message}${error.stdout ? `\n\nStdout: ${error.stdout}` : ''}${error.stderr ? `\n\nStderr: ${error.stderr}` : ''}`
                }
              ]
            }
          };
        }
      } else {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } else {
      throw new Error(`Unknown method: ${request.method}`);
    }
  } catch (error) {
    debugLog(`Request processing error: ${error.message}`);
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: error.message
      }
    };
  }
}

// stdin からのデータ処理
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (data) => {
  const lines = data.trim().split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    try {
      const request = JSON.parse(line);
      const response = await handleRequest(request);
      console.log(JSON.stringify(response));
    } catch (error) {
      debugLog(`JSON parsing error: ${error.message}`);
      console.log(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error'
        }
      }));
    }
  }
});

// エラーハンドリング
process.on('uncaughtException', (error) => {
  debugLog(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  debugLog(`Unhandled rejection at ${promise}: ${reason}`);
  process.exit(1);
});

debugLog('MCP Shell Server ready and waiting for requests');
