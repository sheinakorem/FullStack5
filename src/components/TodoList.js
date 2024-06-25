import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('myAppData'));
    if (storedData && storedData.ToDo) {
      setTodos(storedData.ToDo);
      setCounter(storedData.counter || 1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myAppData', JSON.stringify({ ToDo: todos, counter }));
  }, [todos, counter]);

  const handleSaveTodo = (todo) => {
    if (todo.id) {
      // Update existing todo
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? todo : t))
      );
    } else {
      // Add new todo
      todo.id = counter;
      setTodos((prevTodos) => [...prevTodos, todo]);
      setCounter(counter + 1);
    }
    setSelectedTodo(null);
  };

  const handleEditTodo = (todo) => {
    setSelectedTodo(todo);
  };

  const handleToggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="todo-list">
      <TodoForm existingTodo={selectedTodo} onSave={handleSaveTodo} />
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          index={index}
          onEdit={handleEditTodo}
          onToggle={handleToggleTodo}
        />
      ))}
      <div>Total items: {todos.length}</div>
    </div>
  );
};

export default TodoList;
