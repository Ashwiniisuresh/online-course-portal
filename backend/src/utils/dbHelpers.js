const firstResultSet = (rows) => {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows[0] || [];
};

const firstRow = (rows) => {
  const dataset = firstResultSet(rows);
  return dataset.length ? dataset[0] : null;
};

module.exports = {
  firstResultSet,
  firstRow,
};
