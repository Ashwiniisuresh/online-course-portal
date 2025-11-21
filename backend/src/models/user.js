const { callProcedure } = require('../config/db');
const { firstRow } = require('../utils/dbHelpers');

const mapUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  password: row.password,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getByEmail = async (email) => {
  const rows = await callProcedure('sp_users_get_by_email', [email]);
  const rawUser = firstRow(rows);
  return rawUser ? mapUser(rawUser) : null;
};

const getById = async (id) => {
  const rows = await callProcedure('sp_users_get_by_id', [id]);
  const rawUser = firstRow(rows);
  return rawUser ? mapUser(rawUser) : null;
};

const create = async ({ name, email, password }) => {
  const rows = await callProcedure('sp_users_create', [name, email, password]);
  const rawUser = firstRow(rows);
  return rawUser ? mapUser(rawUser) : null;
};

module.exports = {
  getByEmail,
  getById,
  create,
  mapUser,
};
