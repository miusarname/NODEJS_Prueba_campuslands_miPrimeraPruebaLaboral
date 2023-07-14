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
  

  inventarios.post('/',  async (req, res) => {
    const { id_producto, id_bodega, cantidad } = req.body;
  
    try {
      // Verificar si la combinación de bodega y producto ya existe
      const [existingInventory] = await connection.query(
        'SELECT id, cantidad FROM inventarios WHERE id_producto = ? AND id_bodega = ?',
        [id_producto, id_bodega]
      );
  
      if (existingInventory.length === 0) {
        // Combinación nueva, realizar un INSERT
        await connection.query('INSERT INTO inventarios (id_producto, id_bodega, cantidad) VALUES (?, ?, ?)', [
          id_producto,
          id_bodega,
          cantidad,
        ]);
      } else {
        // Combinación existente, realizar un UPDATE
        const updatedQuantity = existingInventory[0].cantidad + cantidad;
        await connection.query('UPDATE inventarios SET cantidad = ? WHERE id = ?', [updatedQuantity, existingInventory[0].id]);
      }
  
      res.status(200).json({ message: 'Registro insertado correctamente' });
    } catch (error) {
      console.error('Error al insertar en la tabla de inventarios:', error);
      res.status(500).json({ message: 'Error al insertar en la tabla de inventarios' });
    }
  });

inventarios.put('/traslados', async (req, res) => {
  const { id_producto, id_bodega_origen, id_bodega_destino, cantidad } = req.body;

  try {
    // Verificar si la cantidad solicitada se puede extraer de la bodega de origen
    const [originInventory] = await connection.query(
      'SELECT id, cantidad FROM inventarios WHERE id_producto = ? AND id_bodega = ?',
      [id_producto, id_bodega_origen]
    );

    if (!originInventory || originInventory.length === 0 || originInventory[0].cantidad < cantidad) {
      res.status(400).json({ message: 'No hay suficientes unidades en la bodega de origen' });
      return;
    }

    // Realizar el traslado
    const updatedOriginQuantity = originInventory[0].cantidad - cantidad;
    const [destinationInventory] = await connection.query(
      'SELECT id, cantidad FROM inventarios WHERE id_producto = ? AND id_bodega = ?',
      [id_producto, id_bodega_destino]
    );

    if (destinationInventory && destinationInventory.length > 0) {
      // Actualizar el inventario de destino
      const updatedDestinationQuantity = destinationInventory[0].cantidad + cantidad;
      await connection.query('UPDATE inventarios SET cantidad = ? WHERE id = ?', [
        updatedDestinationQuantity,
        destinationInventory[0].id,
      ]);
    } else {
      // Insertar un nuevo registro en el inventario de destino
      await connection.query('INSERT INTO inventarios (id_producto, id_bodega, cantidad) VALUES (?, ?, ?)', [
        id_producto,
        id_bodega_destino,
        cantidad,
      ]);
    }

    // Actualizar el inventario de origen
    await connection.query('UPDATE inventarios SET cantidad = ? WHERE id = ?', [updatedOriginQuantity, originInventory[0].id]);

    // Insertar registro en la tabla de historiales
    await connection.query(
      'INSERT INTO historiales (cantidad, id_bodega_origen, id_bodega_destino, id_inventario) VALUES (?, ?, ?, ?)',
      [cantidad, id_bodega_origen, id_bodega_destino, originInventory[0].id]
    );

    res.status(200).json({ message: 'Traslado realizado correctamente' });
  } catch (error) {
    console.error('Error al realizar el traslado:', error);
    res.status(500).json({ message: 'Error al realizar el traslado' });
  }
});

export default inventarios;
