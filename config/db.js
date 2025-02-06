require('dotenv').config(); 
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance using environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,  
    {
        host: process.env.DB_HOST, 
        dialect: 'mysql',
        port: process.env.MYSQL_PORT, 
    }
);

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
