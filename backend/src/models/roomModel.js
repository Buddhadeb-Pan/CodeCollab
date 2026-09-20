const { pool } = require("../config/db");

const createRoom = async ({ code, name, language, ownerId }) => {
  const result = await pool.query(
    "INSERT INTO rooms (code, name, language, owner_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [code, name, language, ownerId]
  );
  return result.rows[0];
};

const findRoomByCode = async (code) => {
  const result = await pool.query(
    `SELECT r.*, u.name AS owner_name, u.email AS owner_email
     FROM rooms r
     JOIN users u ON u.id = r.owner_id
     WHERE r.code = $1`,
    [code]
  );
  return result.rows[0];
};

const findRoomById = async (id) => {
  const result = await pool.query("SELECT * FROM rooms WHERE id = $1", [id]);
  return result.rows[0];
};

const getUserRooms = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM rooms WHERE owner_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

const deleteRoom = async (id, ownerId) => {
  const result = await pool.query(
    "DELETE FROM rooms WHERE id = $1 AND owner_id = $2 RETURNING *",
    [id, ownerId]
  );
  return result.rows[0];
};

module.exports = { createRoom, findRoomByCode, findRoomById, getUserRooms, deleteRoom };
