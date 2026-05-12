import express from 'express';
import router from "./routes/trainRoutes.js";
import errorHandler from './middleware/errorHandler.js';

const app = express();
const ENV = process.env.NODE_ENV ?? 'development';

app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: "Hejhej! Välkommen till Tåg-API'et! ", environment: ENV});
});

app.use("/api/tag", router);
app.use(errorHandler);

export default app;