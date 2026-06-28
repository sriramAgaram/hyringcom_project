const _ = require('lodash');

// Allowed fields for a card
const ALLOWED_FIELDS = ['title', 'status', 'position'];

// Helper to strip out unwanted fields
const sanitizeData = (data) => {
  return _.pick(data, ALLOWED_FIELDS);
};

// Prepare values array for SQL insert
const prepareCreateData = (data) => {
  const cleanData = sanitizeData(data);
  const { title, status = 'To Do', position = 0 } = cleanData;
  return [title, status, position];
};

// Prepare keys and values for SQL update
const prepareUpdateData = (id, data) => {
  const cleanData = sanitizeData(data);
  const keys = Object.keys(cleanData);
  
  if (keys.length === 0) {
    return { keys: [], values: [] };
  }

  const values = [id, ...keys.map(key => cleanData[key])];
  return { keys, values };
};

module.exports = {
  sanitizeData,
  prepareCreateData,
  prepareUpdateData
};
