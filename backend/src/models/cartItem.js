const { callProcedure } = require('../config/db');
const { firstResultSet, firstRow } = require('../utils/dbHelpers');
const { mapCourse } = require('./course');

const mapCartItem = (row) => {
  const course = row.course_id
    ? mapCourse({
        id: row.course_id,
        title: row.course_title,
        description: row.course_description,
        price: row.course_price,
        created_at: row.course_created_at,
        updated_at: row.course_updated_at,
      })
    : null;

  return {
    id: row.cart_item_id || row.id,
    userId: row.user_id,
    courseId: row.course_id,
    quantity: row.quantity,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    course,
    Course: course,
  };
};

const listByUser = async (userId) => {
  const rows = await callProcedure('sp_cart_get_by_user', [userId]);
  return firstResultSet(rows).map(mapCartItem);
};

const addOrIncrement = async ({ userId, courseId, quantity }) => {
  const rows = await callProcedure('sp_cart_add_or_increment', [
    userId,
    courseId,
    quantity,
  ]);
  const rawItem = firstRow(rows);
  return rawItem ? mapCartItem(rawItem) : null;
};

const removeItem = async ({ cartItemId, userId }) => {
  const rows = await callProcedure('sp_cart_remove_item', [
    cartItemId,
    userId,
  ]);
  const result = firstRow(rows);
  return result ? Boolean(result.affected_rows) : false;
};

const clear = async (userId) => {
  const rows = await callProcedure('sp_cart_clear', [userId]);
  const result = firstRow(rows);
  return result ? Number(result.affected_rows) : 0;
};

const removeByCourse = async ({ userId, courseId }) => {
  await callProcedure('sp_cart_remove_by_course', [userId, courseId]);
};

module.exports = {
  listByUser,
  addOrIncrement,
  removeItem,
  clear,
  removeByCourse,
  mapCartItem,
};
