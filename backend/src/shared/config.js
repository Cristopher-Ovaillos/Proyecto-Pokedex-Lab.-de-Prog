module.exports = {
    
    BASE_URL: 'http://192.168.1.41:3000',
    PORT: 3000,
    IMAGE_URL: 'http://192.168.1.41:3000/data/pokemon',
    SALT_ROUNDS: 10,
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key'
};
