module.exports = {
    
    BASE_URL: 'ip:3000',
    PORT: 3000,
    IMAGE_URL: 'data/pokemon',
    SALT_ROUNDS: 10,
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key'
};
