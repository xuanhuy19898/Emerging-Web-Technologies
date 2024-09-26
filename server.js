const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database('./api.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS movies`);
    db.run(`CREATE TABLE movies (
        rowid INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        release_year TEXT,
        time_viewed TEXT
    )`);
});


//COLLECTION

app.get('/api', (req, res) => {
    db.all('SELECT * FROM movies', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.put('/api', (req, res) => {
    const newMovies = req.body;
    db.serialize(() => {
        db.run('DELETE FROM movies');
        newMovies.forEach(movie => {
            db.run(`INSERT INTO movies (title, release_year, time_viewed) VALUES (?, ?, ?)`, 
                [movie.title, movie.release_year, movie.time_viewed]);
        });
        res.json({ status: 'REPLACE COLLECTION SUCCESSFUL' });
    });
});

app.post('/api', (req, res) => {
    const { title, release_year, time_viewed } = req.body;
    db.run(`INSERT INTO movies (title, release_year, time_viewed) VALUES (?, ?, ?)`,
        [title, release_year, time_viewed], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ status: 'CREATE ENTRY SUCCESSFUL' });
        });
});

app.delete('/api', (req, res) => {
    db.run('DELETE FROM movies', (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ status: 'DELETE COLLECTION SUCCESSFUL' });
    });
});


//ITEMS

app.get('/api/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM movies WHERE rowid = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(row);
    });
});

app.put('/api/:id', (req, res) => {
    const { id } = req.params;
    const { title, release_year, time_viewed } = req.body;
    db.run(`UPDATE movies SET title = ?, release_year = ?, time_viewed = ? WHERE rowid = ?`, 
        [title, release_year, time_viewed, id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ status: 'UPDATE ITEM SUCCESSFUL' });
        });
});

app.delete('/api/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM movies WHERE rowid = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ status: 'DELETE ITEM SUCCESSFUL' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
