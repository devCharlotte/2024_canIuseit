const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'resources')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/calendar', (req, res) => {
    res.render('calendar');
});

app.get('/label', (req, res) => {
    res.render('label');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/look', (req, res) => {
    res.render('look');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});