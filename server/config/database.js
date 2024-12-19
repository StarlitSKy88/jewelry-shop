require('dotenv').config();

const sourceConfig = {
    host: process.env.SOURCE_DB_HOST,
    user: process.env.SOURCE_DB_USER,
    password: process.env.SOURCE_DB_PASSWORD,
    database: process.env.SOURCE_DB_NAME,
};

const destConfig = {
    host: process.env.DEST_DB_HOST,
    user: process.env.DEST_DB_USER,
    password: process.env.DEST_DB_PASSWORD,
    database: process.env.DEST_DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
};

module.exports = {
    sourceConfig,
    destConfig
}; 