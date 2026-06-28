const validateCardCreate = (req, res, next) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a valid string' });
  }
  next();
};

const validateCardUpdate = (req, res, next) => {
  const { title, status, position } = req.body;
  const allowedStatuses = ['To Do', 'In Progress', 'Done'];

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }
  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be one of: To Do, In Progress, Done' });
  }
  if (position !== undefined && typeof position !== 'number') {
    return res.status(400).json({ error: 'Position must be a number' });
  }
  next();
};

module.exports = {
  validateCardCreate,
  validateCardUpdate,
};
