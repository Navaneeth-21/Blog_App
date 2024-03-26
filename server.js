const express = require('express');
const app = express();
const articleRouter = require('./routes/article');
const article = require('./models/article');
const connectDB = require('./db/connect');
const methodOverride = require('method-override')
const port = process.env.port || 3000;
require('dotenv').config();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//tells the router to look for a query parameter called _method to determine the HTTP request
app.use(methodOverride("_method"));

// Middleware to handle data parsing
app.get('/', async (req, res) => {
    try {
        let articles = await article.find().sort({
            createdAt: 'desc'
        });
        res.render('./articles/index', { articles: articles });

    } catch (error) {
        res.status(400).json({ message: `Error occured ${error}` });
    }
});

app.use('/articles', articleRouter);

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
