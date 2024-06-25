import React, { useState, useEffect } from 'react';

const TodoForm = ({ existingTodo, onSave }) => {
  const [todo, setTodo] = useState({ id: '', ToDoName: '', completed: false });

  useEffect(() => {
    if (existingTodo) {
      setTodo(existingTodo);
    }
  }, [existingTodo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodo({
      ...todo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todo.ToDoName.trim()) {
      onSave(todo);
      setTodo({ id: '', ToDoName: '', completed: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="ToDoName"
        value={todo.ToDoName}
        onChange={handleChange}
        placeholder="Enter to-do"
      />
      <button type="submit">{existingTodo ? 'Update' : 'Add'}</button>
    </form>
  );
};

export default TodoForm;
