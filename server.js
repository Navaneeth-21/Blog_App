const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const articleRouter = require('./routes/article');
const userRouter = require('./routes/user');
const article = require('./models/article');
const connectDB = require('./db/connect');
const methodOverride = require('method-override')
const port = process.env.port || 3000;
const { createToken, validateToken } = require('./utils/token');
require('dotenv').config();

const app = express();

app.use(cors());

app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//tells the router to look for a query parameter called _method to determine the HTTP request
app.use(methodOverride("_method"));


app.get('/', (req, res) => {
    res.render('./index/landing_page')
});

// Middleware to handle data parsing
app.get('/articles', validateToken, async (req, res) => {
    try {
        let articles = await article.find({ userID: req.user.id }).sort({
            createdAt: 'desc'
        });
        res.render('./articles/index', { articles: articles });

    } catch (error) {
        res.status(400).json({ message: `Error occured ${error}` });
    }
});

app.use('/articles', articleRouter);
app.use('/', userRouter);

// connecting the database 
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Database connected successfully");

        app.listen(port, () => console.log(`Server running on http://localhost:${port} `));
    }
    catch (error) {
        console.log(error);
    }
}
start();
