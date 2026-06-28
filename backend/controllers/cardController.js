const pool = require('../config/supabase');
const cardModel = require('../models/cardModel');
const cardQueries = require('../queries/cardQueries');
const historyModel = require('../models/historyModel');
const historyQueries = require('../queries/historyQueries');

const getCards = async (req, res) => {
  try {
    const result = await pool.query(cardQueries.GET_ALL_CARDS);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

const createCard = async (req, res) => {
  try {
    const values = cardModel.prepareCreateData(req.body);
    const result = await pool.query(cardQueries.CREATE_CARD, values);
    const newCard = result.rows[0];
    
    // Broadcast the new card to all connected WebSocket clients
    req.app.get('io').emit('card_created', newCard);
    
    res.status(201).json(newCard);
  } catch (err) {
    console.error('Error creating card:', err);
    res.status(500).json({ error: 'Failed to create card' });
  }
};

const updateCard = async (req, res) => {
  try {
    const id = req.params.id;
    
    // 1. If status is being updated, we need to know the old status to record history
    let oldCard = null;
    if (req.body.status) {
      const oldCardResult = await pool.query('SELECT status, title FROM cards WHERE id = $1', [id]);
      if (oldCardResult.rows.length > 0) {
        oldCard = oldCardResult.rows[0];
      }
    }

    // 2. Prepare and execute the update query
    const { keys, values } = cardModel.prepareUpdateData(id, req.body);
    
    if (keys.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const query = cardQueries.buildUpdateQuery(keys);
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    const updatedCard = result.rows[0];
    
    // 3. If the card was moved (status changed), record it in the history table
    if (oldCard && oldCard.status !== updatedCard.status) {
      const historyValues = historyModel.prepareHistoryData({
        card_id: updatedCard.id,
        card_title: updatedCard.title,
        from_status: oldCard.status,
        to_status: updatedCard.status
      });
      await pool.query(historyQueries.INSERT_HISTORY, historyValues);
    }
    
    // Broadcast the updated card to all connected WebSocket clients
    req.app.get('io').emit('card_updated', updatedCard);
    
    res.status(200).json(updatedCard);
  } catch (err) {
    console.error('Error updating card:', err);
    res.status(500).json({ error: 'Failed to update card' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(cardQueries.DELETE_CARD, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    // Broadcast the deleted card ID to all connected WebSocket clients
    req.app.get('io').emit('card_deleted', id);
    
    res.status(200).json({ message: 'Card deleted successfully', id });
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(500).json({ error: 'Failed to delete card' });
  }
};

module.exports = {
  getCards,
  createCard,
  updateCard,
  deleteCard
};
