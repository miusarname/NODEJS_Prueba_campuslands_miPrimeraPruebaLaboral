-- Active: 1687894134079@@localhost@3306@db_prueba
USE db_prueba;

CREATE TABLE historiales (
  id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cantidad INT(11) NOT NULL,
  id_bodega_origen BIGINT(20) UNSIGNED,
  id_bodega_destino BIGINT(20) UNSIGNED,
  id_inventario BIGINT(20) UNSIGNED,
  created_by BIGINT(20) UNSIGNED,
  update_by BIGINT(20) UNSIGNED,
  created_at TIMESTAMP DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT NULL,
  deleted_at TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  FOREIGN KEY (update_by) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  FOREIGN KEY (id_inventario) REFERENCES inventarios(id)  
);




CREATE TABLE bodegas(
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE ,
    id_responsable BIGINT(20) UNSIGNED,
    estado TINYINT(4),
    created_by BIGINT(20) UNSIGNED,
    update_by BIGINT(20) UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,
    Foreign Key (id_responsable) REFERENCES users(id),
    Foreign Key (created_by) REFERENCES users(id),
    Foreign Key (update_by) REFERENCES users(id)
);

CREATE TABLE users(
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP,
    estado TINYINT(4),
    created_by BIGINT(20) UNSIGNED,
    update_by BIGINT(20) UNSIGNED,
    foto VARCHAR(255) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventarios(
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_bodega BIGINT(20) UNSIGNED,
    id_producto BIGINT(20) UNSIGNED,
    cantidad INT(11) NOT NULL,
    created_by BIGINT(20) UNSIGNED,
    update_by BIGINT(20) UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,
    Foreign Key (id_producto) REFERENCES productos(id),
    Foreign Key (created_by) REFERENCES users(id),
    Foreign Key (update_by) REFERENCES users(id)
);

CREATE TABLE productos(
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estado TINYINT(4) NOT NULL,
    created_by BIGINT(20) UNSIGNED,
    update_by BIGINT(20) UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,
    Foreign Key (created_by) REFERENCES users(id),
    Foreign Key (update_by) REFERENCES users(id)
);

ALTER TABLE historiales
ADD CONSTRAINT FK_historiales
FOREIGN KEY (id_bodega_origen) REFERENCES bodegas(id);

ALTER TABLE historiales
ADD CONSTRAINT FK_historiale
FOREIGN KEY (id_bodega_destino) REFERENCES bodegas(id);

ALTER TABLE inventarios
ADD CONSTRAINT FK_inventarios
FOREIGN KEY (id_bodega) REFERENCES bodegas(id);

/* ALTER TABLE historiales
ADD CONSTRAINT FK_historiales2
FOREIGN KEY (id_inventario) REFERENCES productos(id); */

ALTER TABLE historiales
MODIFY created_at TIMESTAMP DEFAULT NULL;








