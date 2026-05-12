import express from 'express';
import router from "./routes/trainRoutes.js";

const app = express();
const ENV = process.env.NODE_ENV ?? 'development';

app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: "Välkommen till Tåg-API'et!", environment: ENV});
});

app.use("/api/tag", router);

export default app;