"""
Sandbox implementation for AgentForge OSS.
Provides secure execution environment for agent tools.
"""

import logging
import asyncio
import tempfile
import os
import subprocess
import uuid
import json
from typing import Dict, Any, Optional, Union

logger = logging.getLogger(__name__)

class ToolSandbox:
    """Sandbox for executing tools in a secure environment"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the sandbox with optional configuration"""
        self.config = config or {}
        self.timeout_seconds = self.config.get('timeout_seconds', 30)
        self.memory_limit_mb = self.config.get('memory_limit_mb', 512)
        self.max_processes = self.config.get('max_processes', 5)
    
    async def run_code(self, code: str, language: str = 'python') -> Dict[str, Any]:
        """
        Run code in a sandbox environment.
        
        Args:
            code: The code to execute
            language: The programming language of the code
            
        Returns:
            A dictionary containing the execution result
        """
        if language.lower() != 'python':
            return {
                'success': False,
                'error': f'Unsupported language: {language}',
                'stdout': '',
                'stderr': f'Only Python is supported at this time'
            }
        
        logger.info(f"Running Python code in sandbox (length: {len(code)})")
        
        # Create a unique identifier for this execution
        execution_id = str(uuid.uuid4())
        
        try:
            # Create a temporary file for the code
            with tempfile.NamedTemporaryFile(suffix='.py', mode='w', delete=False) as tf:
                tf.write(code)
                temp_file = tf.name
            
            # Build the command with resource limits
            cmd = []
            
            if os.name == 'posix':  # Linux/Mac
                # Use the timeout command to limit execution time
                cmd = [
                    'timeout', str(self.timeout_seconds),
                    'python', temp_file
                ]
            elif os.name == 'nt':  # Windows
                # On Windows, we'll handle the timeout in Python
                cmd = ['python', temp_file]
            
            # Create subprocess
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            try:
                # Wait for the process to complete with a timeout
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(),
                    timeout=self.timeout_seconds
                )
                
                # Decode the output
                stdout_str = stdout.decode('utf-8', errors='replace')
                stderr_str = stderr.decode('utf-8', errors='replace')
                
                return {
                    'success': process.returncode == 0,
                    'exit_code': process.returncode,
                    'stdout': stdout_str,
                    'stderr': stderr_str,
                    'execution_id': execution_id
                }
            
            except asyncio.TimeoutError:
                # Kill the process if it times out
                try:
                    process.kill()
                except:
                    pass
                
                return {
                    'success': False,
                    'error': f'Execution timed out after {self.timeout_seconds} seconds',
                    'stdout': '',
                    'stderr': 'Timeout error',
                    'execution_id': execution_id
                }
        
        except Exception as e:
            logger.error(f"Error in sandbox execution: {e}")
            return {
                'success': False,
                'error': str(e),
                'stdout': '',
                'stderr': str(e),
                'execution_id': execution_id
            }
        
        finally:
            # Clean up the temporary file
            try:
                os.unlink(temp_file)
            except:
                pass
    
    async def run_tool(self, tool_code: str, tool_input: Any) -> Dict[str, Any]:
        """
        Execute a tool in the sandbox.
        
        Args:
            tool_code: The tool code to execute
            tool_input: The input to pass to the tool
            
        Returns:
            The result of the tool execution
        """
        # Create a wrapper script that calls the tool function with the input
        wrapper_code = f"""
import json
import sys

# Tool code
{tool_code}

# Parse input
tool_input = {json.dumps(tool_input)}

# Execute the tool function (assuming it's named 'execute')
try:
    result = execute(tool_input)
    print(json.dumps({{"success": True, "result": result}}))
except Exception as e:
    print(json.dumps({{"success": False, "error": str(e)}}))
"""
        
        # Execute the wrapper script
        execution_result = await self.run_code(wrapper_code, 'python')
        
        if not execution_result['success']:
            return {
                'success': False,
                'error': execution_result.get('stderr', 'Unknown error'),
                'execution_id': execution_result.get('execution_id')
            }
        
        # Parse the JSON output
        try:
            stdout = execution_result.get('stdout', '').strip()
            result = json.loads(stdout)
            return result
        except json.JSONDecodeError:
            return {
                'success': False,
                'error': f'Failed to parse tool output as JSON: {stdout}',
                'execution_id': execution_result.get('execution_id')
            } 