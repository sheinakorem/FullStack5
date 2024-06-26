import React from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, onEdit, onToggle, onDelete, index }) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {index + 1}. {todo.ToDoName} (ID: {todo.id})
      </span>
      <button onClick={() => onEdit(todo)}>Edit</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
};

export default TodoItem;
