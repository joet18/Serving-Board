const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function init() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await conn.query(`USE \`${process.env.DB_NAME}\``);

    await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            username    VARCHAR(100) UNIQUE NOT NULL,
            password    VARCHAR(255) NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await conn.query(`
        CREATE TABLE IF NOT EXISTS events (
            id          VARCHAR(50) PRIMARY KEY,
            title       VARCHAR(255) NOT NULL,
            date        DATE NOT NULL,
            category    VARCHAR(50) NOT NULL,
            capacity    INT NOT NULL,
            description TEXT,
            created_by  VARCHAR(100) NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await conn.query(`
        CREATE TABLE IF NOT EXISTS enrollments (
            id        INT AUTO_INCREMENT PRIMARY KEY,
            event_id  VARCHAR(50) NOT NULL,
            username  VARCHAR(100) NOT NULL,
            UNIQUE KEY unique_enrollment (event_id, username),
            FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
        )
    `);

    // Seed default events
    const seedPath = path.join(__dirname, '..', '..', 'Data', 'default-events.json');
    const defaults = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

    for (const ev of defaults) {
        await conn.query(
            `INSERT IGNORE INTO events (id, title, date, category, capacity, description, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [ev.id, ev.title, ev.date, ev.category, ev.capacity, ev.description, ev.createdBy]
        );
    }

    console.log('✅ Database initialized and seeded.');
    await conn.end();
}

init().catch(err => { console.error(err); process.exit(1); });
