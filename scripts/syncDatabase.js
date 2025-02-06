const sequelize = require('../config/db');
const User = require('../models/User');
const Work = require('../models/Work');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Set to true to drop existing tables
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

syncDatabase();
