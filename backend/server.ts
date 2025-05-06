import { buildApp } from './src/app';

async function startServer() {
  const server = await buildApp();
  
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
  
  server.listen({ port }, (err, address) => {
    if (err) throw err;
    console.log(`Server running at ${address}`);
  });
  
  return server;
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// For testing purposes
export default startServer();
