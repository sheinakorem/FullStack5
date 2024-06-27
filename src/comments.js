import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './posts.css';

const Comments = () => {
    const { userId, postId } = useParams(); // Fetch userId and postId from URL params
    const [postComments, setPostComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // loading comments from ls
    const loadCommentsFromLocalStorage = () => {
        const savedComments = localStorage.getItem(`comments_${postId}`);
        return savedComments ? JSON.parse(savedComments) : [];
    };

    // saving the comments to the ls
    const saveCommentsToLocalStorage = (comments) => {
        localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
    };

    //fetching the information from the website
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const savedComments = loadCommentsFromLocalStorage();
                if (savedComments.length > 0) {
                    setPostComments(savedComments);
                } else {
                    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch comments');
                    }
                    const data = await response.json();
                    setPostComments(data);
                    saveCommentsToLocalStorage(data);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [postId]);

    //adding a new comment
    const handleAddComment = async () => {
        const newCommentObj = {
            postId: Number(postId),
            id: Date.now(), 
            body: newComment,
        };
        const updatedComments = [...postComments, newCommentObj];
        setPostComments(updatedComments);
        saveCommentsToLocalStorage(updatedComments);

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCommentObj),
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
        setNewComment('');
    };

    //deleting a comment
    const handleDeleteComment = async (commentId) => {
        const updatedComments = postComments.filter((comment) => comment.id !== commentId);
        setPostComments(updatedComments);
        saveCommentsToLocalStorage(updatedComments);

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // updating a comment
    const handleInputChange = (event) => {
        setNewComment(event.target.value);
    };

    return (
        <div>
            <h1 className="comments-header">Comments for Post {postId}</h1>
            <ul className="comments-list">
                {postComments.map((comment) => (
                    <li key={comment.id} className="comment-item">
                        <span>{comment.body}</span>
                        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div>
                <textarea value={newComment} onChange={handleInputChange} placeholder="Enter your comment..." />
                <button onClick={handleAddComment}>Add Comment</button>
            </div>
        </div>
    );
};

export default Comments;
