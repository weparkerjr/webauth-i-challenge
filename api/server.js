// REQUIRED PACKAGES
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session); // remember to pass the session

// CONST TO MY CREATED FOLDERS
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knexConnection = require('../database/dbConfig.js'); /// <<<<<<<<<

const server = express();

// SESSION CONFIGURATION
const sessionOptions = {
  name: 'fiftyfirstdates',
  secret: process.env.COOKIE_SECRET || 'keep it secret, keep it safe!', // for encryption
  cookie: {
    secure: process.env.COOKIE_SECURE || false, // in production should be true, false for development
    maxAge: 1000 * 60 * 60 * 24, // how long is the session good for, in milliseconds
    httpOnly: true, // client JS has no access to the cookie
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 60, // how long before we clear out expired sessions
  }),
};

// GLOBAL MIDDLEWARE
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));

// ROUTE HANDLERS
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up', session: req.session }); // <<<<<<<<<<<
});

module.exports = server;
