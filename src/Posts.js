import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Posts.css';

const Posts = () => {
    const [postId, setPostId] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [newPostHeader, setNewPostHeader] = useState('');
    const [newPostContent, setNewPostContent] = useState('');

    //getting the post id from ls
    useEffect(() => {
        const savedPostId = localStorage.getItem('postId');
        if (savedPostId) {
            setPostId(savedPostId);
        }
    }, []);
    //putting postid from ls
    const savePostIdToLocalStorage = (postId) => {
        localStorage.setItem('postId', postId);
    };
//getting posts from ls
    const loadPostsFromLocalStorage = () => {
        const savedPosts = localStorage.getItem('posts');
        return savedPosts ? JSON.parse(savedPosts) : [];
    };
//posting the posts to ls
    const savePostsToLocalStorage = (posts) => {
        localStorage.setItem('posts', JSON.stringify(posts));
    };
//going to the right url and fetching the info
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const savedPosts = loadPostsFromLocalStorage();
                if (savedPosts.length > 0) {
                    setUserPosts(savedPosts);
                } else {
                    const response = await fetch(`http://localhost:3000/posts/${postId}/comments`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch comments');
                    }
                    const data = await response.json();
                    setUserPosts(data);
                    savePostsToLocalStorage(data);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchPosts();
    }, [postId]);
//to edit the post
    const handleEdit = (postId) => {
        const postToEdit = userPosts.find((post) => post.postId === postId);
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [postId]: {
                isEditing: !prevEditMode[postId]?.isEditing,
                postHeader: postToEdit.postHeader,
                postContent: postToEdit.postContent,
            },
        }));
    };
//saving the changes 
    const handleSave = async (postId) => {
        const updatedPosts = userPosts.map((post) =>
            post.postId === postId
                ? { ...post, postHeader: editMode[postId].postHeader, postContent: editMode[postId].postContent }
                : post
        );
        setUserPosts(updatedPosts);
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [postId]: { ...prevEditMode[postId], isEditing: false },
        }));
        savePostsToLocalStorage(updatedPosts);

        // save changes to json
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postHeader: editMode[postId].postHeader,
                    postContent: editMode[postId].postContent,
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
        const updatedPosts = userPosts.filter((post) => post.postId !== postId);
        setUserPosts(updatedPosts);
        savePostsToLocalStorage(updatedPosts);

        // delete post from json
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
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
            postId: postId, 
            postHeader: newPostHeader,
            postContent: newPostContent,
        };
        const updatedPosts = [...userPosts, newPost];
        setUserPosts(updatedPosts);
        setNewPostHeader('');
        setNewPostContent('');
        savePostsToLocalStorage(updatedPosts);

        // add new post to json
        try {
            const response = await fetch('http://localhost:3000/posts', {
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
//changing a post
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
//the http for the page
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
                    <li key={post.postId}>
                        {editMode[post.postId]?.isEditing ? (
                            <div>
                                <input type="text" value={editMode[post.postId]?.postHeader} onChange={(e) => handleInputChange(e, 'postHeader')} />
                                <input type="text" value={editMode[post.postId]?.postContent} onChange={(e) => handleInputChange(e, 'postContent')} />
                            </div>
                        ) : (
                            <div>
                                <h3>{post.postHeader}</h3>
                                <p>{post.postContent}</p>
                            </div>
                        )}
                        {editMode[post.postId]?.isEditing ? (
                            <button onClick={() => handleSave(post.postId)}>Save</button>
                        ) : (
                            <button onClick={() => handleEdit(post.postId)}>Edit</button>
                        )}
                        <button onClick={() => handleDelete(post.postId)}>Delete</button>
                        <Link className="linkComment" to={`${post.postId}/comments`}>Comments</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Posts;
