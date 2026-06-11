// tests/setup.js
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.test') });
process.env.NODE_ENV = 'test';

const { sequelize } = require('../src/models');

console.log(`🗄️  Database: ${process.env.DB_NAME}`);
console.log(`🔧 Environment: ${process.env.NODE_ENV}`);

// Variable globale  
let isDbSynced = false;

beforeAll(async () => {
    if (!isDbSynced) {
        try {
            // Désactiver les contraintes
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            
            // Récupérer et supprimer toutes les tables
            const [tables] = await sequelize.query('SHOW TABLES');
            for (const table of tables) {
                const tableName = Object.values(table)[0];
                await sequelize.query(`DROP TABLE IF EXISTS ${tableName}`);
            }
            
            // Réactiver les contraintes
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
            
            // Recréer les tables
            await sequelize.sync({ force: true });
            
            isDbSynced = true;
            console.log('✅ Test database synchronized');
        } catch (error) {
            console.error('❌ Test database error:', error.message);
            throw error;
        }
    }
});

afterAll(async () => {
    await sequelize.close();
});