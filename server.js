const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const PORT = 3000;

// custom middleware logger
app.use(logger);
                                                                                                
const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3000', 'https://www.google.com'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

// Cross Origin Resource Sharing
// Open to everyone use
// app.use(cors());

// Only allow access the whitelist domain
app.use(cors(corsOptions));

// built-in middleware to handle urlencode data [form data]
app.use(express.urlencoded({ extended: false}));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));
// allow subdir routes access to css
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employess'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({ err: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found')
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});