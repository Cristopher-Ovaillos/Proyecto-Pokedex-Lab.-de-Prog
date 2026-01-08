module.exports = {
    
    BASE_URL: 'IP:3000',
    BASE_CLOUDINARY: 'https://res.cloudinary.com/dsagyolzc/image/upload',
    // Ejemplo para hacer un resize de la imagen con la url 
    // https://res.cloudinary.com/dsagyolzc/image/upload/w_96,h_96/1.png
    PORT: 3000,
    IMAGE_URL: 'data/pokemon',
    SALT_ROUNDS: 10,
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key'
};
