const _ = require('lodash');

const prepareHistoryData = (data) => {
  // Extract only the fields allowed for history tracking
  const allowedFields = ['card_id', 'card_title', 'from_status', 'to_status'];
  const sanitizedData = _.pick(data, allowedFields);

  // Basic validation could go here
  if (!sanitizedData.card_id || !sanitizedData.card_title || !sanitizedData.from_status || !sanitizedData.to_status) {
    throw new Error('Missing required fields for history tracking');
  }

  return [
    sanitizedData.card_id,
    sanitizedData.card_title,
    sanitizedData.from_status,
    sanitizedData.to_status
  ];
};

module.exports = {
  prepareHistoryData
};
