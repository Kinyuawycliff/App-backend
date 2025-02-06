const Update = require('../models/update');

// Create a new update
exports.createUpdate = async (req, res) => {
  const { title, notification, sender } = req.body;
  try {
    const newUpdate = await Update.create({ title, notification, sender });
    res.status(201).json(newUpdate);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create update' });
  }
};

// Get all updates
exports.getAllUpdates = async (req, res) => {
  try {
    const updates = await Update.findAll();
    res.status(200).json(updates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve updates' });
  }
};

// Get an update by ID
exports.getUpdateById = async (req, res) => {
  const { id } = req.params;
  try {
    const update = await Update.findByPk(id);
    if (!update) return res.status(404).json({ error: 'Update not found' });

    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve update' });
  }
};

// Update an existing update
exports.updateUpdate = async (req, res) => {
  const { id } = req.params;
  const { title, notification, sender } = req.body;
  try {
    const update = await Update.findByPk(id);
    if (!update) return res.status(404).json({ error: 'Update not found' });

    update.title = title;
    update.notification = notification;
    update.sender = sender;

    await update.save();
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
};

// Delete an update
exports.deleteUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const update = await Update.findByPk(id);
    if (!update) return res.status(404).json({ error: 'Update not found' });

    await update.destroy();
    res.status(200).json({ message: 'Update deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete update' });
  }
};
