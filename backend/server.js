const express = require('express');
const users = require('./apis/user');
const posts = require('./apis/post');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const mongoDBEndpoint = 'mongodb+srv://hunter:banana2@seawebdevfall2021.ykjok.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDBEndpoint, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', function() {
    console.log('MongoDB connected successfully');
});

app.use(cors({
    origin: 'https://web-final-frontend.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users/', users);
app.use('/api/posts/', posts);

let frontend_dir = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontend_dir));

app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});

app.listen(process.env.PORT || 8000, function() {
    console.log("Starting server now...");
});