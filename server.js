import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT ?? 3000;
const ENV = process.env.NODE_ENV ?? 'development';

//Starta servern
app.listen(PORT, () => {
  console.log(`Servern tuffar fram på http://localhost:${PORT} i ${ENV}-läge 🚅`);
});

