// require('dotenv').config(); 
// const { Sequelize } = require('sequelize');

// // Create a new Sequelize instance using environment variables
// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,  
//     {
//         host: process.env.DB_HOST, 
//         dialect: 'mysql',
//         port: process.env.MYSQL_PORT, 
//     }
// );

// // Test the connection
// sequelize.authenticate()
//     .then(() => console.log('Database connected...'))
//     .catch(err => console.log('Error: ' + err));

// module.exports = sequelize;





// require("dotenv").config();

// const http = require("http");
// const { neon } = require("@neondatabase/serverless");

// const sql = neon(process.env.DATABASE_URL);

// const requestHandler = async (req, res) => {
//   const result = await sql`SELECT version()`;
//   const { version } = result[0];
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end(version);
// };

// http.createServer(requestHandler).listen(3000, () => {
//   console.log("Server running at http://localhost:3000");
// });



//DATABASE_URL='postgresql://neondb_owner:npg_NoHC06jMYQAz@ep-young-haze-a8jl75kh-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'



require('dotenv').config();
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance using a connection URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
});

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
