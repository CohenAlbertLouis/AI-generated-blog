const axios = require('axios');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
// 1. Correct Endpoint for Modern Hugging Face Router
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions"; 

// 2. Approved Model ID (Llama 3.1, for which access was granted)
const MODEL_ID = "meta-llama/Llama-3.1-8B-Instruct"; 

// 3. YOUR TOKEN (Ensure this is correctly set)
const HF_ACCESS_TOKEN = "insert_valid_huggingface_access_token"; 

const TOPICS = [
    "The Future of Serverless Computing",
    "Best Practices in React Hooks",
    "Optimizing PostgreSQL Performance",
    "Introduction to Docker Networking",
    "A Guide to AWS CodeBuild and ECR"
];

// --- Core Function ---
async function generateAndSaveArticle(articlesFilePath) {
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    // Prompt is designed to force the model to output a parsable format
    const prompt = `Write a short (3-paragraph), engaging blog article on the topic: "${topic}". Start the article with a title followed by a single newline. Return ONLY the title and article content, no preamble or extra text.`;

    console.log(`Running daily article generation job...`);
    console.log(`Generating article for topic: ${topic}`);

    // Simplified Payload: Only Model and Messages are included to avoid 400 errors
    const payload = {
        model: MODEL_ID, 
        messages: [{
            role: "user",
            content: prompt,
        }],
        // Removed max_tokens and temperature for stability
    };

    try {
        const response = await axios.post(
            HF_API_URL, 
            payload,
            {
                headers: {
                    Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                },
                timeout: 60000 // Increase timeout for LLM calls
            }
        );

        const responseData = response.data;

        // --- Response Parsing Logic for Chat Completions Endpoint ---
        let generatedText = '';
        if (responseData && responseData.choices && responseData.choices[0].message.content) {
            generatedText = responseData.choices[0].message.content.trim();
        } else {
            console.error("Hugging Face API returned no generated text or unexpected structure.");
            return;
        }

        // --- Original Parsing Logic to separate Title and Content ---
        const lines = generatedText.split('\n').filter(line => line.trim() !== '');

        let title = `[AI Generated] ${topic}`;
        let content = generatedText;

        if (lines.length > 1) {
            title = lines[0].trim().substring(0, 150); 
            content = lines.slice(1).join('\n\n');
        } else if (generatedText.length > 50) {
             const firstPeriodIndex = generatedText.indexOf('.');
             if (firstPeriodIndex !== -1 && firstPeriodIndex < 100) {
                 title = generatedText.substring(0, firstPeriodIndex + 1).trim();
                 content = generatedText.substring(firstPeriodIndex + 1).trim();
             }
        }
        
        title = title.replace(/^(\*|#|\d+\.)\s*/, '').trim();
        content = content.trim();
        // --- End Original Parsing Logic ---

        const newArticle = {
            id: Date.now().toString(),
            title: title || `Generated Article ${Date.now()}`,
            // Clean up common LLM artifacts like double quotes at start/end
            content: content.replace(/^"|"$/g, '').trim() || "The AI failed to generate content."
        };

        // Read, append, and save the articles to articles.json
        let articles = [];
        if (fs.existsSync(articlesFilePath)) {
            const fileContent = fs.readFileSync(articlesFilePath, 'utf-8');
            articles = fileContent ? JSON.parse(fileContent) : [];
        }

        articles.unshift(newArticle); 
        fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2));

        console.log(`Successfully generated and saved new article: "${newArticle.title}"`);

    } catch (error) {
        console.error("Error generating article from Hugging Face:", error.message || error);
    }
}

module.exports = { generateAndSaveArticle };