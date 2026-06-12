// Assure-toi que les variables d'environnement sont correctes pour Docker
const sequelize = new Sequelize(
    process.env.DB_NAME || 'taskflow_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'rootpassword',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);