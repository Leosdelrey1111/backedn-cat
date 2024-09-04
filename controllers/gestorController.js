const connection = require('../connection')
const bcrypt = require('bcryptjs');


// Función para crear un administrador
exports.createAdmin = (req, res) => {
  const { nom_usr, app_usr, passwd_usr, email_usr, nom_ag } = req.body;

  // Buscar el id_agencia basado en el nombre de la agencia
  connection.execute('SELECT id_agencia FROM Agencia WHERE nom_ag = ?', [nom_ag], (error, agenciaResults) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (agenciaResults.length === 0) {
      return res.status(404).json({ error: 'Agencia no encontrada' });
    }

    const id_agencia = agenciaResults[0].id_agencia;

    // Encriptar la contraseña
    bcrypt.hash(passwd_usr, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Insertar el nuevo usuario administrador
      connection.execute(
        'INSERT INTO Usuario (nom_usr, app_usr, passwd_usr, email_usr, status, role) VALUES (?, ?, ?, ?, "true", "admin")',
        [nom_usr, app_usr, hashedPassword, email_usr],
        (insertError, userResults) => {
          if (insertError) {
            return res.status(500).json({ error: insertError.message });
          }

          const id_usr = userResults.insertId;

          // Insertar en AdminAgencia con el id_usr y id_agencia
          connection.execute(
            'INSERT INTO AdminAgencia (id_usr, id_agencia) VALUES (?, ?)',
            [id_usr, id_agencia],
            (adminError) => {
              if (adminError) {
                return res.status(500).json({ error: adminError.message });
              }

              res.status(201).json({ id_usr, id_agencia });
            }
          );
        }
      );
    });
  });
};

// Función para obtener todos los administradores
exports.getAllAdmins = (req, res) => {
  connection.execute(
    'SELECT u.*, a.nom_ag FROM Usuario u JOIN AdminAgencia aa ON u.id_usr = aa.id_usr JOIN Agencia a ON aa.id_agencia = a.id_agencia WHERE u.role = "admin"',
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results);
    }
  );
};


// Función para actualizar un administrador
exports.updateAdmin = (req, res) => {
  const { id_usr, nom_usr, app_usr, passwd_usr, email_usr, nom_ag } = req.body;

  // Buscar el id_agencia basado en el nombre de la agencia
  connection.execute('SELECT id_agencia FROM Agencia WHERE nom_ag = ?', [nom_ag], (error, agenciaResults) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (agenciaResults.length === 0) {
      return res.status(404).json({ error: 'Agencia no encontrada' });
    }

    const id_agencia = agenciaResults[0].id_agencia;

    // Encriptar la contraseña
    bcrypt.hash(passwd_usr, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Actualizar el usuario administrador
      connection.execute(
        'UPDATE Usuario SET nom_usr = ?, app_usr = ?, passwd_usr = ?, email_usr = ? WHERE id_usr = ?',
        [nom_usr, app_usr, hashedPassword, email_usr, id_usr],
        (updateError) => {
          if (updateError) {
            return res.status(500).json({ error: updateError.message });
          }

          // Actualizar en AdminAgencia
          connection.execute(
            'UPDATE AdminAgencia SET id_agencia = ? WHERE id_usr = ?',
            [id_agencia, id_usr],
            (adminError) => {
              if (adminError) {
                return res.status(500).json({ error: adminError.message });
              }

              res.status(200).json({ id_usr, id_agencia });
            }
          );
        }
      );
    });
  });
};


// Función para eliminar un administrador
exports.deleteAdmin = (req, res) => {
  const { id_usr } = req.params;

  // Eliminar de AdminAgencia
  connection.execute('DELETE FROM AdminAgencia WHERE id_usr = ?', [id_usr], (deleteAdminAgenciaError) => {
    if (deleteAdminAgenciaError) {
      return res.status(500).json({ error: deleteAdminAgenciaError.message });
    }

    // Eliminar de Usuario
    connection.execute('DELETE FROM Usuario WHERE id_usr = ?', [id_usr], (deleteUsuarioError) => {
      if (deleteUsuarioError) {
        return res.status(500).json({ error: deleteUsuarioError.message });
      }

      res.status(200).json({ message: 'Administrador eliminado correctamente' });
    });
  });
};


//Para crear Agencias

exports.createAgencia = (req, res) => {
    const { nom_ag } = req.body;
    connection.query(
      'INSERT INTO Agencia (nom_ag) VALUES (?)',
      [nom_ag],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: error.message });
          return;
        }
        res.status(201).json({ id_agencia: results.insertId, nom_ag });
      }
    );
  };
  
  exports.getAllAgencias = (req, res) => {
    connection.query('SELECT * FROM Agencia', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results);
    });
  };
  

  exports.getAgenciaById = (req, res) => {
    const { id_agencia } = req.params;
    connection.query(
      'SELECT * FROM Agencia WHERE id_agencia = ?',
      [id_agencia],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: error.message });
          return;
        }
        res.status(200).json(results[0]);
      }
    );
  };
  
  exports.updateAgencia = (req, res) => {
    const { id_agencia, nom_ag } = req.body;
    connection.query(
      'UPDATE Agencia SET nom_ag = ? WHERE id_agencia = ?',
      [nom_ag, id_agencia],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: error.message });
          return;
        }
        res.status(200).json({ id_agencia, nom_ag });
      }
    );
  };
  
  exports.deleteAgencia = (req, res) => {
    const { id_agencia } = req.params;
    connection.query(
      'DELETE FROM Agencia WHERE id_agencia = ?',
      [id_agencia],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: error.message });
          return;
        }
        res.status(200).json({ message: 'Agencia eliminada correctamente' });
      }
    );
  };