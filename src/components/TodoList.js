import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [counter, setCounter] = useState(1);
  const [sortCriterion, setSortCriterion] = useState('serial');
  const [searchQuery, setSearchQuery] = useState('');

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
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? todo : t))
      );
    } else {
      todo.id = counter;
      setTodos((prevTodos) => [...prevTodos, todo]);
      setCounter(counter + 1);
    }
    setSelectedTodo(null);
  };

  const handleEditTodo = (todo) => {
    setSelectedTodo(todo);
  };

  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
      localStorage.setItem('myAppData', JSON.stringify({ ToDo: updatedTodos, counter }));
      return updatedTodos;
    });
  };

  const handleToggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleSortChange = (e) => {
    setSortCriterion(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const sortTodos = (todos) => {
    switch (sortCriterion) {
      case 'serial':
        return [...todos].sort((a, b) => a.id - b.id);
      case 'completed':
        return [...todos].sort((a, b) => a.completed - b.completed);
      case 'alphabetical':
        return [...todos].sort((a, b) => a.ToDoName.localeCompare(b.ToDoName));
      case 'random':
        return [...todos].sort(() => Math.random() - 0.5);
      default:
        return todos;
    }
  };

  const filteredAndSortedTodos = sortTodos(
    todos.filter(
      (todo) =>
        todo.ToDoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.id.toString().includes(searchQuery) ||
        (searchQuery === 'completed' && todo.completed) ||
        (searchQuery === 'not completed' && !todo.completed)
    )
  );

  return (
    <div className="todo-list">
      <TodoForm existingTodo={selectedTodo} onSave={handleSaveTodo} />
      <div>
        <label>Sort by: </label>
        <select value={sortCriterion} onChange={handleSortChange}>
          <option value="serial">Serial</option>
          <option value="completed">Completed</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="random">Random</option>
        </select>
      </div>
      <div>
        <label>Search: </label>
        <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search by ID, name, status" />
      </div>
      {filteredAndSortedTodos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          index={index}
          onEdit={handleEditTodo}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />
      ))}
      <div>Total items: {filteredAndSortedTodos.length}</div>
    </div>
  );
};

export default TodoList;
