import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors())
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  return res.send('Token Registration API');
});

app.use('/getUserInfo',require('./routes/tokenRoutes'));



// Start server
const port =  process.env.PORT || 8081;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


const stopServer = (signal: string) => {
  server.close((err) => {
    const exitCode = err ? 1 : 0;
    console.log('Server has been shut down', { exitCode, signal });
    process.exit(exitCode);
  });
}
['SIGTERM', 'SIGINT'].map(sig => process.on(sig, () => stopServer(sig)));

process.on('uncaughtException',(err: Error) => {
  console.error(`uncaughtException: ${err?.message}`, err);
  process.exit(2);
});

process.on('unhandledRejection', (err: Error) => {
  console.error(`unhandledRejection: ${err?.message}`, err);
  process.exit(3);
});
