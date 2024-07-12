const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const path = require('path');

const app = express();
const port = 3000;
const JWT_SECRET = 'your_jwt_secret';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use(express.static('public'));

app.post('/register', upload.single('profile-picture'), async (req, res) => {
    const { username, email, password } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!username || !email || !password) {
        return res.status(400).send('All fields are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, profilePicture]
        );
        res.status(201).send(newUser.rows[0]);
    } catch (err) {
        if (err.code === '23505') { // unique violation
            return res.status(400).send('Email already registered');
        }
        res.status(500).send('Server error');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('All fields are required');
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).send('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        const token = jwt.sign({ userid: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).send({ token, userid: user.rows[0].id });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
