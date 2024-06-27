import React from 'react';
import { Link } from 'react-router-dom';
import './user.css';



const userId = JSON.parse(localStorage.getItem('myData'))?.id;

const User = () => {
    return (
        <div className="user-item">
            <h1>User Page</h1>
            <nav>
                <ul>
                    <li>
                        <Link to={`/users/${userId}/todo`}>TodoList</Link>
                    </li>
                    <li>
                        <Link to={`/users/${userId}/posts`}>Posts</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default User;
