import React, { useState, useEffect } from 'react';
import './todo.css';

const TodoForm = ({ existingTodo, onSave }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (existingTodo) {
      setTitle(existingTodo.title);
    }
  }, [existingTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const todo = existingTodo ? { ...existingTodo, title } : { title, completed: false };
    onSave(todo);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{existingTodo ? `Editing: ${existingTodo.title}` : 'Add a new Todo'}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Todo title"
      />
      <button type="submit">{existingTodo ? 'Update Todo' : 'Add Todo'}</button>
    </form>
  );
};

export default TodoForm;
