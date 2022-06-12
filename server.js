const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
// Serve to all files
require('dotenv').config();

const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const connectDB = require('./config/dbConnection');

// Connect to MongoDB
connectDB();

const PORT = 3000;

// custom middleware logger
app.use(logger);

// Handle options credential check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
                                                                                                
// Cross Origin Resource Sharing
// Open to everyone use
// app.use(cors());

// Only allow access the whitelist domain
app.use(cors(corsOptions));

// built-in middleware to handle urlencode data [form data]
app.use(express.urlencoded({ extended: false}));

// built-in middleware for json
app.use(express.json());

// middelware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));
// allow subdir routes access to css
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// routes
app.use('^/$', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employess'));

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({ err: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found')
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
});
