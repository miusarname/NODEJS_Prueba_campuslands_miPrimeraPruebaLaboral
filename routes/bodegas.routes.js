import {Router} from 'express';
import mysql from 'mysql2'

const bodega = Router();

let con = undefined;

bodega.use((req, res, next) => {
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

  bodega.get("/", (req, res) => {
    try{
      con.query(
          `SELECT * FROM bodegas`,
          [req.body.nom_com, req.body.edad],
          (err, data, fils) => {
            console.log(err);
            console.log(data);
            console.log(fils);
            res.send(data);
          },
        );
    }catch (e){
      res.sendStatus(500).send("Ha habido un error...")
    }
  });

  bodega.get('/bodegas-ordenadas-alfabéticamente',(req, res) =>{
    
  })


export default bodega