const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = {
    
    BASE_URL: `${process.env.IP}:3000`||'localhost:3000',
    PORT: 3000,
    IMAGE_URL: 'https://res.cloudinary.com/dsagyolzc/image/upload',
    SALT_ROUNDS: 10,
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key'
};
