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

inventarios.put('/traslado', (req, res) => {
  
  const { origen, destino, cantidad } = req.body;

  // Verificar que la cantidad a trasladar sea posible
  connection.query('SELECT unidades FROM inventarios WHERE bodega = ?', [origen], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en la consulta de inventarios.' });
    }

    const unidadesEnOrigen = results[0].unidades;
    if (unidadesEnOrigen < cantidad) {
      return res.status(400).json({ error: 'No hay suficientes unidades en la bodega de origen.' });
    }

    // Realizar el traslado
    connection.beginTransaction((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al iniciar la transacción.' });
      }

      // Actualizar la bodega de origen
      connection.query('UPDATE inventarios SET unidades = unidades - ? WHERE bodega = ?', [cantidad, origen], (err) => {
        if (err) {
          connection.rollback(() => {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar la bodega de origen.' });
          });
        }

        // Actualizar la bodega de destino
        connection.query('UPDATE inventarios SET unidades = unidades + ? WHERE bodega = ?', [cantidad, destino], (err) => {
          if (err) {
            connection.rollback(() => {
              console.error(err);
              return res.status(500).json({ error: 'Error al actualizar la bodega de destino.' });
            });
          }

          // Insertar en la tabla de historiales
          const registro = {
            origen,
            destino,
            cantidad,
            fecha: new Date(),
          };

          connection.query('INSERT INTO historiales SET ?', registro, (err) => {
            if (err) {
              connection.rollback(() => {
                console.error(err);
                return res.status(500).json({ error: 'Error al insertar en la tabla de historiales.' });
              });
            }

            connection.commit((err) => {
              if (err) {
                connection.rollback(() => {
                  console.error(err);
                  return res.status(500).json({ error: 'Error al confirmar la transacción.' });
                });
              }

              res.json({ message: 'Traslado realizado con éxito.' });
            });
          });
        });
      });
    });
  });
});

export default inventarios;
