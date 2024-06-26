import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Post from './Posts';
import Comments from './comments';
//putting the posts and comments on the page
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/posts" element={<Post />} />
                <Route path="/posts/:id/comments" element={<Comments />} />
            </Routes>
        </Router>
    );
};

export default App;
