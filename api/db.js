const { Pool } = require("pg");
 
// Les valeurs viennent des variables d'environnement définies dans docker-compose.yml
const pool = new Pool({
  host: process.env.DB_HOST,          // "db" = nom du service dans Docker Compose
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
 
module.exports = pool;