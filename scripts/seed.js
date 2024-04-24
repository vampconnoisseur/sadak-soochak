const { db } = require('@vercel/postgres');

async function seedReports(client) {
    try {
        await client.sql`
        CREATE TABLE IF NOT EXISTS reports (
            id SERIAL PRIMARY KEY,
            location VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            date DATE NOT NULL,
            contact_name VARCHAR(255),
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            severity VARCHAR(20) NOT NULL,
            feedback TEXT,
            imageurl VARCHAR(255)
          );        
    `;

        console.log(`Created "reports" table`);
    } catch (error) {
        console.error('Error seeding reports:', error);
        throw error;
    }
}

async function main() {
    const client = await db.connect();
    await seedReports(client);
    await client.end();
}

main().catch((err) => {
    console.error(
        'An error occurred while attempting to seed the database:',
        err,
    );
});
