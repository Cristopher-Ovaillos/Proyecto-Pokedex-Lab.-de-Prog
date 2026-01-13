module.exports = {
    
    BASE_URL: 'IP:3000',
    PORT: 3000,
    IMAGE_URL: 'https://res.cloudinary.com/dsagyolzc/image/upload',
    SALT_ROUNDS: 10,
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key'
};
