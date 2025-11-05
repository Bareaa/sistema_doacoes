const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.NODE_ENV === 'production') {
  // Production configuration using DATABASE_URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else if (process.env.NODE_ENV === 'test') {
  // Test configuration
  sequelize = new Sequelize(
    process.env.TEST_DB_NAME || 'sistema_doacoes_test',
    process.env.TEST_DB_USER || 'postgres',
    process.env.TEST_DB_PASSWORD || 'password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false
    }
  );
} else {
  // Development configuration
  if (process.env.DATABASE_URL) {
    // Use NeonDB URL if available
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: console.log
    });
  } else {
    // Fallback to local database
    sequelize = new Sequelize(
      process.env.DB_NAME || 'sistema_doacoes_dev',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'password',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: console.log
      }
    );
  }
}

module.exports = sequelize;