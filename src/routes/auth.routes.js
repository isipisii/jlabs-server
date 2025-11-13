const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db/db");

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: "Missing credentials" });
		}

		const row = await db.getAsync("SELECT * FROM users WHERE email = ?", [email]);
		if (!row) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const isValid = await bcrypt.compare(password, row.password_hash);

		if (!isValid) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// sign the token using user credentials
		const token = jwt.sign({ userId: row.id, email: row.email }, process.env.JWT_SECRET, { expiresIn: "8h" });

		res.json({ token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
