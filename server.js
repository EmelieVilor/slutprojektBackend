import express from "express";
import "dotenv/config";
import mysql from "mysql2/promise";

const app = express();
const PORT = process.env.PORT ?? 3000;
const ENV = process.env.NODE_ENV ?? 'development';

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

app.get('/', (req, res) => {
  res.json({message: 'Hej!', environment: ENV});
});

//Hämta all data i databasen 
app.get("/api", async (req,res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM tag;");
        res.json(rows);
    } catch(error){
      console.error(error);
      res.status(500).json({ error: "Kunde inte hämta databas." });
    }
});


//Hämta alla tåg
app.get("/api/tag", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM tag ORDER BY tagnr ASC;");
    // res.json(rows);
    res.json({
      meta:{
        antal_tag: rows.length,
        status: "success",
        tidpunkt: new Date().toLocaleTimeString()
      },
      data: rows
    });
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

//Hämta alla vagnar
app.get("/api/vagnar", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM vagnar ORDER BY tagnr;");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta vagnarna." });
  }
});

//Visa antal vagnar per tåg
app.get("/api/vagnar/antal", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT t.tagnr, COUNT(v.vagnsnr) AS antal_vagnar FROM tag t JOIN vagnar v ON t.tagnr=v.tagnr GROUP BY t.tagnr;");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta vagnarna." });
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

//Skapa meta-data
app.get("/api/")

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


//Starta servern

app.listen(PORT, () => {
  console.log(`Servern tuffar fram på http://localhost:${PORT} i ${ENV}-läge`);
});
