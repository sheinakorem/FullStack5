import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styless.css';

const Posts = () => {
    const userId = JSON.parse(localStorage.getItem('myData'))?.id;
    const [postId, setPostId] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [newPostHeader, setNewPostHeader] = useState('');
    const [newPostContent, setNewPostContent] = useState('');

//saving the posts into the ls
    const setToLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    useEffect(() => {
        const savedPostId = localStorage.getItem('postId');
        if (savedPostId) {
            setPostId(savedPostId);
        }
    }, []);
//saving just the postID
    const savePostIdToLocalStorage = (postId) => {
        localStorage.setItem('postId', postId);
    };

    //fetching the posts from the website
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setUserPosts(data);
                setToLocalStorage('posts', data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        if (userId) {
            fetchPosts();
        }
    }, [userId]);

    //editing a post
    const handleEdit = (postId) => {
        const postToEdit = userPosts.find((post) => post.id === postId);
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [postId]: {
                isEditing: !prevEditMode[postId]?.isEditing,
                postHeader: postToEdit.title,
                postContent: postToEdit.body,
            },
        }));
    };

    //saving a post
    const handleSave = async (postId) => {
        const updatedPosts = userPosts.map((post) =>
            post.id === postId
                ? { ...post, title: editMode[postId].postHeader, body: editMode[postId].postContent }
                : post
        );
        setUserPosts(updatedPosts);
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [postId]: { ...prevEditMode[postId], isEditing: false },
        }));
        setToLocalStorage('posts', updatedPosts);

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: postId, 
                    title: editMode[postId].postHeader,
                    body: editMode[postId].postContent,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    //deleting a post
    const handleDelete = async (postId) => {
        const updatedPosts = userPosts.filter((post) => post.id !== postId);
        setUserPosts(updatedPosts);
        setToLocalStorage('posts', updatedPosts);

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    //adding a new post
    const handleAdd = async () => {
        const newPost = {
            userId: userId,
            id: Date.now(),
            title: newPostHeader,
            body: newPostContent,
        };
        const updatedPosts = [...userPosts, newPost];
        setUserPosts(updatedPosts);
        setNewPostHeader('');
        setNewPostContent('');
        setToLocalStorage('posts', updatedPosts);

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });
            if (!response.ok) {
                throw new Error('Failed to add post');
            }
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    //changes in input
    const handleInputChange = (event, type) => {
        switch (type) {
            case 'postId':
                setPostId(event.target.value);
                savePostIdToLocalStorage(event.target.value);
                break;
            case 'postHeader':
                setNewPostHeader(event.target.value);
                break;
            case 'postContent':
                setNewPostContent(event.target.value);
                break;
            default:
                break;
        }
    };
//when editing a post and there are changes
    const handleEditInputChange = (event, postId, field) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [postId]: {
                ...prevEditMode[postId],
                [field]: event.target.value,
            },
        }));
    };
//rendering
    return (
        <div>
            <h1 className="post-header">POSTS</h1>
            <div>
                <input type="text" value={postId} onChange={(e) => handleInputChange(e, 'postId')} placeholder="Enter post ID..." />
                <input type="text" value={newPostHeader} onChange={(e) => handleInputChange(e, 'postHeader')} placeholder="Enter post header..." />
                <input type="text" value={newPostContent} onChange={(e) => handleInputChange(e, 'postContent')} placeholder="Enter post content..." />
                <button onClick={handleAdd}>Add Post</button>
            </div>
            <ul className="posts-list">
                {userPosts.map((post) => (
                    <li key={post.id}  className='post-item'>
                        {editMode[post.id]?.isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    value={editMode[post.id]?.postHeader}
                                    onChange={(e) => handleEditInputChange(e, post.id, 'postHeader')}
                                />
                                <input
                                    type="text"
                                    value={editMode[post.id]?.postContent}
                                    onChange={(e) => handleEditInputChange(e, post.id, 'postContent')}
                                />
                            </div>
                        ) : (
                            <div>
                                <h3>{post.title}</h3>
                                <p >{post.body}</p>
                            </div>
                        )}
                        {editMode[post.id]?.isEditing ? (
                            <button onClick={() => handleSave(post.id)}>Save</button>
                        ) : (
                            <button onClick={() => handleEdit(post.id)}>Edit</button>
                        )}
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                        <Link className="linkComment" to={`${post.id}/comments`}>Comments</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Posts;
