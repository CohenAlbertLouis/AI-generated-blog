import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// The backend service is available on the same host but on port 3001 locally.
// In production, the Nginx proxy handles the routing, so we use a relative path ('/api').
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/articles`)
            .then(response => {
                setArticles(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching articles:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading articles...</div>;

    return (
        <div>
            <h2>Latest Articles</h2>
            {articles.length === 0 ? (
                <p>No articles found. Check the backend server logs.</p>
            ) : (
                <div style={styles.list}>
                    {articles.map(article => (
                        <div key={article.id} style={styles.articleCard}>
                            <h3><Link to={`/articles/${article.id}`} style={styles.articleLink}>{article.title}</Link></h3>
                            <p>{article.snippet}</p>
                            <Link to={`/articles/${article.id}`} style={styles.readMore}>Read More &rarr;</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    list: { display: 'grid', gap: '20px' },
    articleCard: { 
        padding: '20px', 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    articleLink: { textDecoration: 'none', color: '#007bff' },
    readMore: { display: 'inline-block', marginTop: '10px', color: '#28a745', textDecoration: 'none', fontWeight: 'bold' }
};

export default ArticleList;