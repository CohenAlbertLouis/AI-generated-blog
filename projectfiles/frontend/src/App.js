import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleList from './ArticleList';
import ArticleView from './ArticleView';

// Helper for consistent API base URL across local and deployment environments
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';
console.log(`Using API Base URL: ${API_BASE_URL}`);

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <header style={styles.header}>
          <Link to="/" style={styles.logo}><h1>🤖 AI Blog Challenge</h1></Link>
        </header>
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/articles/:id" element={<ArticleView />} />
          </Routes>
        </main>
        <footer style={styles.footer}>
            <p>&copy; 2025 Auto-Generated Blog</p>
        </footer>
      </div>
    </Router>
  );
}

const styles = {
    container: { fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    header: { borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '30px' },
    logo: { textDecoration: 'none', color: '#333' },
    main: { flexGrow: 1 },
    footer: { marginTop: '40px', paddingTop: '10px', borderTop: '1px solid #eee', textAlign: 'center', color: '#666' }
};

export default App;