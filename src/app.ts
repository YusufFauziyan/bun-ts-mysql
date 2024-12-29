import express, { Express } from 'express';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';

const app: Express = express();

app.use(bodyParser.json());
app.use('/api', userRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
