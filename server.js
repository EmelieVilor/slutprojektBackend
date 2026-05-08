import express from "express";
import "dotenv/config";
import mysql from "mysql2/promise";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

//Connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

//Routes
//Hämta alla tåg
app.get("/api/tag", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM tag ORDER BY tagnr ASC;");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta tåglistan." });
  }
});

//Hämta alla vagnstyper
app.get("/api/vagnstyp", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT typ FROM vagnstyp;");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta vagnstyperna." });
  }
});

//Hämta alla avgångar från vald station
app.get("/api/tag/:station", async (req, res) => {
  const valdStation = req.params.station;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM Tag ORDER BY avgangstid ASC;",
    );

    const filtreradeTag = rows.filter((tåg) => {
      return tåg.Avgangsstation === valdStation;
    });

    if (filtreradeTag.length === 0) {
      return res
        .status(404)
        .json({ message: `Hittade inga tåg från ${valdStation}` });
    }

    res.json(filtreradeTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta avgångstiderna." });
  }
});

//Skapa nytt tåg
app.post("/api/tag", async (req, res) => {
  const {
    Tagnr,
    Typ,
    Avgangsstation,
    Slutstation,
    Avgangstid,
    Ankomsttid,
    Vandningsinfo,
  } = req.body;

  if (!Tagnr || !Avgangsstation || !Slutstation) {
    res.status(400).json({
      error: "Tågnr, avgångsstation och slutstation krävs.",
    });
  }

  if (Tagnr.toString().length > 3) {
    res.status(400).json({
      error: "Felaktigt tågnummer.",
      message: "Tågnummer får inte vara mer än 3 siffror långt.",
    });
  }

  try {
    const sql = `INSERT INTO Tagnr (Tagnr, Typ, Avgangsstation, Slutstation, Avgangstid, Ankomsttid, Vandningsinfo) VALUES (?,?,?,?,?,?,?)`;

    await pool.execute(sql, [
      Tagnr,
      Typ,
      Avgangsstation,
      Slutstation,
      Avgangstid,
      Ankomsttid,
      Vandningsinfo,
    ]);

    res.status(201).json({ message: `Tåg ${Tagnr} har skapats!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gick inte att spara tåget i databasen..." });
  }
});

app.listen(PORT, () => {
  console.log(`Servern tuffar fram på http://localhost:${PORT}`);
});
