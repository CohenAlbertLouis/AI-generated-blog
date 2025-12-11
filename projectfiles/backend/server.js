const express = require('express');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const cors = require('cors');
const { generateAndSaveArticle } = require('./jobs/generateArticle');

const app = express();
const PORT = 3001;
const ARTICLES_FILE = path.join(__dirname, 'articles.json');

app.use(cors());
app.use(express.json());

// Check if articles.json exists and has at least 3 articles
function ensureInitialArticles() {
    if (!fs.existsSync(ARTICLES_FILE) || JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8')).length < 3) {
        console.log("Articles file not found or insufficient. Using pre-populated JSON.");
    }
}
ensureInitialArticles();


// List all articles
app.get('/api/articles', (req, res) => {
    try {
        const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
        const articleList = articles.map(a => ({
            id: a.id,
            title: a.title,
            snippet: a.content.substring(0, 100) + '...'
        }));
        res.json(articleList);
    } catch (error) {
        res.status(500).json({ message: "Could not retrieve articles." });
    }
});

// Retrieve a single article
app.get('/api/articles/:id', (req, res) => {
    try {
        const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
        const article = articles.find(a => a.id === req.params.id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: "Article not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Could not retrieve article." });
    }
});


// Article Generation Scheduling: Set to every 5 minutes for easy testing of the automation requirement.
// Change to '0 0 * * *' for the final daily requirement.
cron.schedule('0 0 * * *', () => {
    console.log('Running daily article generation job...');
    generateAndSaveArticle(ARTICLES_FILE);
});


app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log("Article generation job scheduled (currently daily at midnight).");
});