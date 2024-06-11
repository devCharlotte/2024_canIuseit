const dotenv = require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const FileStore = require('session-file-store')(session);
const cors = require('cors');
const flash = require('connect-flash');

const authRoutes = require('./routes/auth');
const expirationRoutes = require('./routes/expiration');
const sequelize = require('./config/database');
const { initDb } = require('./models/initDb');
require('./config/passport-setup');

const app = express();

// CORS 설정
app.use(cors({
    origin: 'http://localhost:8000',
}));

// 세션 설정
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore()
}));

// Passport 미들웨어 설정
app.use(passport.initialize());
app.use(passport.session());

// Body Parser 미들웨어 설정
app.use(bodyParser.json());

// 플래시 메시지 설정
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// 라우트 설정
app.use('/auth', authRoutes);
app.use('/api', expirationRoutes);


// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '..', 'frontend', 'resources')));

// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/look', (req, res) => {
    res.render('look'); 
});

app.get('/calendar', (req, res) => {
    res.render('calendar'); 
});

app.get('/login', (req, res) => {
    res.render('login'); 
});

app.get('/label', (req, res) => {
    res.render('label'); 
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await initDb();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();