const { callProcedure } = require('../config/db');
const { firstResultSet, firstRow } = require('../utils/dbHelpers');
const { mapCourse } = require('./course');

const mapOrderItem = (row) => {
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
    id: row.id,
    orderId: row.order_id,
    courseId: row.course_id,
    quantity: row.quantity,
    unitPrice: Number(row.unit_price || row.price_at_purchase),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    course,
    Course: course,
  };
};

const mapOrder = (row, items = []) => ({
  id: row.id,
  userId: row.user_id,
  stripeSessionId: row.stripe_session_id,
  amount: Number(row.amount),
  currency: row.currency,
  status: row.status,
  paidAt: row.paid_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  items,
});

const createOrder = async ({ userId, stripeSessionId, amount, currency, status }) => {
  const rows = await callProcedure('sp_orders_create', [
    userId,
    stripeSessionId,
    amount,
    currency,
    status,
  ]);
  const rawOrder = firstRow(rows);
  if (!rawOrder) {
    throw new Error('Unable to create order');
  }
  return mapOrder(rawOrder, []);
};

const addOrderItem = async ({ orderId, courseId, quantity, unitPrice }) => {
  await callProcedure('sp_order_items_insert', [
    orderId,
    courseId,
    quantity,
    unitPrice,
  ]);
};

const getOrderWithItems = async (orderId) => {
  const rows = await callProcedure('sp_orders_get_with_items', [orderId]);
  const rawOrder = firstResultSet(rows)[0];
  if (!rawOrder) {
    return null;
  }
  const items = (rows[1] || []).map(mapOrderItem);
  return mapOrder(rawOrder, items);
};

const getOrderBySession = async ({ userId, sessionId }) => {
  const rows = await callProcedure('sp_orders_get_by_session', [
    userId,
    sessionId,
  ]);
  const rawOrder = firstResultSet(rows)[0];
  if (!rawOrder) {
    return null;
  }
  const items = (rows[1] || []).map(mapOrderItem);
  return mapOrder(rawOrder, items);
};

const finalizeOrder = async ({ orderId, userId }) => {
  const rows = await callProcedure('sp_orders_finalize', [orderId, userId]);
  const rawOrder = firstRow(rows);
  if (!rawOrder) {
    return null;
  }
  return mapOrder(rawOrder, []);
};

const listPaidOrders = async (userId) => {
  const rows = await callProcedure('sp_orders_get_paid', [userId]);
  const orderRows = firstResultSet(rows);
  const itemRows = rows[1] || [];
  const itemsByOrder = itemRows.reduce((acc, row) => {
    if (!acc[row.order_id]) {
      acc[row.order_id] = [];
    }
    acc[row.order_id].push(row);
    return acc;
  }, {});

  return orderRows.map((orderRow) =>
    mapOrder(orderRow, (itemsByOrder[orderRow.id] || []).map(mapOrderItem))
  );
};

module.exports = {
  createOrder,
  addOrderItem,
  getOrderWithItems,
  getOrderBySession,
  finalizeOrder,
  listPaidOrders,
  mapOrder,
  mapOrderItem,
};
