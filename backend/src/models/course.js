const { callProcedure } = require('../config/db');
const { firstResultSet, firstRow } = require('../utils/dbHelpers');

const mapCourse = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  price: Number(row.price),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const list = async () => {
  const rows = await callProcedure('sp_courses_list');
  return firstResultSet(rows).map(mapCourse);
};

const getById = async (id) => {
  const rows = await callProcedure('sp_courses_get_by_id', [id]);
  const rawCourse = firstRow(rows);
  return rawCourse ? mapCourse(rawCourse) : null;
};

const seedDefaults = async () => {
  await callProcedure('sp_courses_seed_defaults');
};

module.exports = {
  list,
  getById,
  seedDefaults,
  mapCourse,
};
