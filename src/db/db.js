const sqlite3 = require("sqlite3").verbose();
const util = require("util");

const db = new sqlite3.Database(process.env.DB_FILE || "./src/db/database.sqlite");
db.getAsync = util.promisify(db.get).bind(db);
db.allAsync = util.promisify(db.all).bind(db);
db.runAsync = util.promisify(db.run).bind(db);

module.exports = db;
