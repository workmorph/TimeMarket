#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

console.error('MCP Shell Server starting...');

// MCP protocol implementation
const server = {
  name: "shell-executor",
  version: "1.0.0"
};

// Handle MCP requests
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (data) => {
  try {
    const lines = data.trim().split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const request = JSON.parse(line);
      console.error(`Received request: ${request.method}`);
      
      if (request.method === 'initialize') {
        const response = {
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
        console.log(JSON.stringify(response));
        
      } else if (request.method === 'tools/list') {
        const response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: [
              {
                name: "shell",
                description: "Execute shell commands",
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
        console.log(JSON.stringify(response));
        
      } else if (request.method === 'tools/call') {
        if (request.params.name === 'shell') {
          const command = request.params.arguments.command;
          console.error(`Executing: ${command}`);
          
          try {
            const result = await execAsync(command, {
              cwd: '/Users/kentanonaka/workmorph/time-bid',
              timeout: 30000,
              maxBuffer: 1024 * 1024 // 1MB buffer
            });
            
            const response = {
              jsonrpc: '2.0',
              id: request.id,
              result: {
                content: [
                  {
                    type: "text",
                    text: `Command: ${command}\n\n✅ STDOUT:\n${result.stdout}\n\n⚠️ STDERR:\n${result.stderr}`
                  }
                ]
              }
            };
            console.log(JSON.stringify(response));
            
          } catch (error) {
            const response = {
              jsonrpc: '2.0',
              id: request.id,
              result: {
                content: [
                  {
                    type: "text", 
                    text: `❌ Error executing: ${command}\n\nError: ${error.message}\n\nSTDOUT: ${error.stdout || 'none'}\n\nSTDERR: ${error.stderr || 'none'}`
                  }
                ]
              }
            };
            console.log(JSON.stringify(response));
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error parsing request: ${error.message}`);
  }
});

console.error('MCP Shell Server ready');
