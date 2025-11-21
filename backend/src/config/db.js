const mysql = require('mysql2/promise');

const charset = process.env.DB_CHARSET || 'utf8mb4';
const preferredCollation = (() => {
  const envCollation = process.env.DB_COLLATION || 'utf8mb4_unicode_ci';
  return envCollation.toLowerCase().startsWith(charset.toLowerCase())
    ? envCollation
    : `${charset}_unicode_ci`;
})();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_LIMIT || 10),
  timezone: 'Z',
});

let cachedCollation = null;

const resolveCollation = async (connection) => {
  if (cachedCollation) {
    return cachedCollation;
  }
  try {
    const [rows] = await connection.query(
      "SELECT @@collation_database AS collation, @@character_set_database AS charset"
    );
    const dbCollation = rows?.[0]?.collation;
    const dbCharset = rows?.[0]?.charset;
    if (dbCollation && dbCollation.toLowerCase().startsWith(charset.toLowerCase())) {
      cachedCollation = dbCollation;
    } else if (dbCharset && dbCharset.toLowerCase() !== charset.toLowerCase()) {
      cachedCollation = preferredCollation;
    } else {
      cachedCollation = dbCollation || preferredCollation;
    }
  } catch (error) {
    cachedCollation = preferredCollation;
  }
  return cachedCollation;
};

const applySessionCollation = async (connection) => {
  const collation = await resolveCollation(connection);
  await connection.query(`SET NAMES '${charset}' COLLATE '${collation}'`);
  await connection.query(
    `SET SESSION collation_connection = '${collation}'`
  );
};

const callProcedure = async (name, params = []) => {
  const placeholders = params.map(() => '?').join(', ');
  const sql = params.length
    ? `CALL ${name}(${placeholders})`
    : `CALL ${name}()`;

  const connection = await pool.getConnection();
  try {
    await applySessionCollation(connection);
    const [rows] = await connection.query(sql, params);
    return rows;
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  callProcedure,
};
