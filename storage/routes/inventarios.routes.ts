import express, { Router } from "express";
import mysql from "mysql2";

const inventarios:Router = express.Router();
let connection:any

inventarios.use((req:any, res, next) => {
    try {
        connection = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
      });
      console.log(connection);
      next();
    } catch (e) {
      res.sendStatus(500);
      res.send(e);
    }
  });
  

  inventarios.post('/', (req, res) => {
  const { id_producto, id_bodega, cantidad } = req.body;

  // Verificar si la combinación de bodega y producto ya existe en la tabla de inventarios
  connection.query(
    'SELECT * FROM inventarios WHERE id_producto = ? AND id_bodega = ?',
    [id_producto, id_bodega],
    (error:any, results:any) => {
      if (error) {
        console.error('Error al verificar la existencia del registro:', error);
        res.status(500).json({ error: 'Ocurrió un error al verificar la existencia del registro' });
        return;
      }

      if (results.length === 0) {
        // Si no existe la combinación, realizar un insert
        connection.query(
          'INSERT INTO inventarios (id_producto, id_bodega, cantidad) VALUES (?, ?, ?)',
          [id_producto, id_bodega, cantidad],
          (error:any) => {
            if (error) {
              console.error('Error al insertar el registro:', error);
              res.status(500).json({ error: 'Ocurrió un error al insertar el registro' });
              return;
            }
            
            res.status(200).json({ message: 'Registro insertado correctamente' });
          }
        );
      } else {
        // Si la combinación existe, realizar un update sumando la cantidad existente con la cantidad nueva
        const existingCantidad = results[0].cantidad;
        const newCantidad = existingCantidad + cantidad;

        connection.query(
          'UPDATE inventarios SET cantidad = ? WHERE id_producto = ? AND id_bodega = ?',
          [newCantidad, id_producto, id_bodega],
          (error:any) => {
            if (error) {
              console.error('Error al actualizar el registro:', error);
              res.status(500).json({ error: 'Ocurrió un error al actualizar el registro' });
              return;
            }

            res.status(200).json({ message: 'Registro actualizado correctamente' });
          }
        );
      }
    }
  );
});

export default inventarios;
