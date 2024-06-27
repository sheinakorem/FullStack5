import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Posts from './Posts';
import Comments from './comments';
import Login from './logIn';
import User from './user';
import TodoList from './TodoList';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm'
//rendering the different commponents of the pages
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/users/:id" element={<User/>} />
                <Route path="/users/:id/posts" element={<Posts />} />
                <Route path="/users/:id/posts/:postId/comments" element={<Comments />} />
                <Route path="/users/:id/todo" element={<TodoList />} />
                
            </Routes>
        </Router>
    );
};

export default App;
