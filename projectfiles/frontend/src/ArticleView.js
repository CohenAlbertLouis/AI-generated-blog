import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

function ArticleView() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/articles/${id}`)
            .then(response => {
                setArticle(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching article:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading article...</div>;
    if (!article) return <div>Article not found or could not be loaded.</div>;

    // Convert newlines in the content to HTML line breaks for proper display
    const contentWithBreaks = article.content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));

    return (
        <div style={styles.article}>
            <h2 style={styles.title}>{article.title}</h2>
            <div style={styles.content}>
                {contentWithBreaks}
            </div>
        </div>
    );
}

const styles = {
    article: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' },
    title: { borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px', color: '#333' },
    content: { lineHeight: '1.8', whiteSpace: 'pre-wrap', color: '#555' }
};

export default ArticleView;