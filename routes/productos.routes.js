import express from 'express';
import mysql from 'mysql2';

const productos = express.Router();
let con = undefined;
productos.use((req, res, next) => {
    try {
      con = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
      });
      console.log(con);
      next();
    } catch (e) {
      res.sendStatus(500)
      res.send(e)
    }
  });



productos.get('/ordenados-descendente', (req, res) => {
  const query = `
  SELECT p.*, SUM(b.cantidad) AS Total
  FROM productos p
  JOIN inventarios b ON p.id = b.id_producto
  GROUP BY p.id
  ORDER BY Total DESC LIMIT 0,100
  `;

  con.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});

export default productos;
