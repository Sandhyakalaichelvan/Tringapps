const mysql = require('mysql2/promise');
const fs = require('fs');

// const config = {
//   host: 'bcpbackendnew.mysql.database.azure.com',
//   user: 'bcpadmin',
//   password: 'B63ntf0rdC@p',
//   database: 'bcp',
//   port: 3306,
//   ssl: {
//     rejectUnauthorized: true,
//     ca: fs.readFileSync('./certs/certificate1.pem')  }
// };

const config = {
  host: '192.168.1.47',
  user: 'admin',
  password: 'root',
  database: 'bcp',
  port: 3306,
  // ssl: {
  //   rejectUnauthorized: true,
  //   ca: fs.readFileSync('./certs/certificate1.pem')  }
};

module.exports = mysql.createPool(config);