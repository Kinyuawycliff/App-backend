const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you have a `config/database.js` for DB connection

const Update = sequelize.define('Update', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notification: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'updates',
  timestamps: true,
});

module.exports = Update;
