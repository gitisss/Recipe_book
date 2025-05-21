import express from 'express';
import { checkLogin } from './controllers/LogInController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (req: express.Request, res: express.Response) : void => {
    res.json({ message: 'שלום עולם מ-Express + TypeScript!' });
});

app.post('/api/logIn', () : void => {
    checkLogin;
});

app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
});

