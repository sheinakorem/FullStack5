import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
//comments for posts
const Comments = () => {
    const { id } = useParams();
    const [postComments, setPostComments] = useState([]);
    const [newComment, setNewComment] = useState('');
//getting the comments from ls
    const loadCommentsFromLocalStorage = () => {
        const savedComments = localStorage.getItem(`comments_${id}`);
        return savedComments ? JSON.parse(savedComments) : [];
    };
//putting the comments into ls
    const saveCommentsToLocalStorage = (comments) => {
        localStorage.setItem(`comments_${id}`, JSON.stringify(comments));
    };
//going to the url and fetching data
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const savedComments = loadCommentsFromLocalStorage();
                if (savedComments.length > 0) {
                    setPostComments(savedComments);
                } else {
                    const response = await fetch(`http://localhost:3000/posts/${id}/comments`);
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
    }, [id]);
//adding a comment
    const handleAddComment = async () => {
        const newCommentObj = {
            postId: Number(id),
            id: postComments.length + 1,
            body: newComment,
        };
        const updatedComments = [...postComments, newCommentObj];
        setPostComments(updatedComments);
        saveCommentsToLocalStorage(updatedComments);

        // add new comment to json-server
        try {
            const response = await fetch('http://localhost:3000/comments', {
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

        // delete comment from json
        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };
//updating comment
    const handleInputChange = (event) => {
        setNewComment(event.target.value);
    };
//the http
    return (
        <div>
            <h1 className="comments-header">Comments</h1>
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
