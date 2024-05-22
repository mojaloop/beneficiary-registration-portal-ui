import express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  return res.send('Token Registration API');
});

app.use('/getUserInfo',require('./routes/tokenRoutes'));



// Start server
const port =  process.env.PORT || 8081;
app.listen(port, () => {

  console.log(`Server started on port ${port}`);
});
