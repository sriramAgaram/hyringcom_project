const GET_ALL_CARDS = 'SELECT * FROM cards ORDER BY position ASC, created_at DESC;';

const CREATE_CARD = `
  INSERT INTO cards (title, status, position)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

const DELETE_CARD = 'DELETE FROM cards WHERE id = $1 RETURNING *;';

const buildUpdateQuery = (keys) => {
  const setClauses = keys.map((key, index) => `${key} = $${index + 2}`);
  return `
    UPDATE cards
    SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;
};

module.exports = {
  GET_ALL_CARDS,
  CREATE_CARD,
  DELETE_CARD,
  buildUpdateQuery
};
