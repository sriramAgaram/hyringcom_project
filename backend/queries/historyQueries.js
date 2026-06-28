const GET_HISTORY_BY_CARD_ID = `
  SELECT * FROM card_history 
  WHERE card_id = $1 
  ORDER BY moved_at DESC
`;

const GET_ALL_HISTORY = `
  SELECT * FROM card_history 
  ORDER BY moved_at DESC
  LIMIT 100
`;

const INSERT_HISTORY = `
  INSERT INTO card_history (card_id, card_title, from_status, to_status)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

module.exports = {
  GET_HISTORY_BY_CARD_ID,
  GET_ALL_HISTORY,
  INSERT_HISTORY
};
