require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const DB_FILE = process.env.DB_FILE || "./src/db/database.sqlite";
const db = new sqlite3.Database(DB_FILE);

db.serialize(async () => {
	db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password_hash TEXT
  );`);

	const email = "candidate@example.com";
	const password = "Password123"; // seed password
	const password_hash = await bcrypt.hash(password, 10);

	db.run(`INSERT OR IGNORE INTO users (email, password_hash) VALUES (?, ?)`, [email, password_hash], function (err) {
		if (err) console.error(err);
		else console.log(`Seeded user: ${email} / ${password}`);
		db.close();
	});
});
