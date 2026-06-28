const pool = require('../config/supabase');
const historyQueries = require('../queries/historyQueries');

const getHistoryByCardId = async (req, res) => {
  try {
    const { cardId } = req.params;
    const result = await pool.query(historyQueries.GET_HISTORY_BY_CARD_ID, [cardId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching card history:', err);
    res.status(500).json({ error: 'Failed to fetch card history' });
  }
};

const getAllHistory = async (req, res) => {
  try {
    const result = await pool.query(historyQueries.GET_ALL_HISTORY);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching all history:', err);
    res.status(500).json({ error: 'Failed to fetch all history' });
  }
};

module.exports = {
  getHistoryByCardId,
  getAllHistory
};
