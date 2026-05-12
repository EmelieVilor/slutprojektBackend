import pool from "../config/db.js";
import errorHandler from "../middleware/errorHandler.js";

//Hämta hela tåg-tabellen
export const getAllTag = async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM tag ORDER BY tagnr ASC;");
    res.json({
      meta: {
        antal_tag: rows.length,
        status: "sucess",
        tidpunkt: new Date().toLocaleTimeString(),
      },
      data: rows,
    });
  } catch (error) {
    next(error); // Skickar felet till errorHandler.js
  }
};

//Hämta alla vagnstyper
export const getAllVagnstyper = async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT typ FROM vagnstyp;");
    res.json({
      meta: {
        antal_tag: rows.length,
        status: "sucess",
        tidpunkt: new Date().toLocaleTimeString(),
      },
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta vagnstyperna." });
  }
};

//Hämta alla vagnar
export const getAllVagnar = async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM vagnar ORDER BY tagnr;");
    res.json({
      meta: {
        antal_tag: rows.length,
        status: "sucess",
        tidpunkt: new Date().toLocaleTimeString(),
      },
      data: rows,
    });
  } catch (error) {
     next(error);
  }
};

//Hämta alla vagnar per tåg
export const getTagVagnar = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      "SELECT t.tagnr, COUNT(v.vagnsnr) AS antal_vagnar FROM tag t JOIN vagnar v ON t.tagnr=v.tagnr GROUP BY t.tagnr;",
    );
    res.json(rows);
  } catch (error) {
     next(error);
  }
};

// Hämta alla tåg från vald station
export const getTagStation = async (req, res, next) => {
  const valdStation = req.params.station;

  try {
    const sql =
      "SELECT * FROM Tag WHERE Avgangsstation = ? ORDER BY avgangstid ASC;";
    const [rows] = await pool.execute(sql, [valdStation]);

    // Om databasen inte hittar några rader är listan tom
    if (rows.length === 0) {
      return res.status(404).json({
        message: `Hittade inga tåg från ${valdStation}`,
      });
    }
    res.json(rows);
  } catch (error) {
     next(error);
  }
};

//Skapa nytt tåg
export const createTag = async (req, res, next) => {
  const {
    Tagnr,
    Avgangsstation,
    Slutstation,
    Typ,
    Avgangstid,
    Ankomsttid,
    Vandningsinfo,
  } = req.body;

  if (!Tagnr || !Avgangsstation || !Slutstation) {
    return res
      .status(400)
      .json({ error: "Tågnummer, avgångsstation och slutstation krävs." });
  }

  try {
    const sql = `INSERT INTO Tag (Tagnr, Typ, Avgangsstation, Slutstation, Avgangstid, Ankomsttid, Vandningsinfo) VALUES (?,?,?,?,?,?,?)`;
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
     next(error);
  }
};
