import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import './todo.css';

const TodoList = () => {
  const userId = JSON.parse(localStorage.getItem('myData'))?.id;
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [counter, setCounter] = useState(1);
  const [sortCriterion, setSortCriterion] = useState('serial');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('todos'));
    if (storedData && storedData.todos) {
      setTodos(storedData.todos);
      setCounter(storedData.todos.length + 1);
    } else {
      const fetchTodos = async () => {
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);
          if (!response.ok) {
            throw new Error('Failed to fetch todos');
          }
          const data = await response.json();
          setTodos(data);
          localStorage.setItem('todos', JSON.stringify({ todos: data, counter: data.length  }));
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      };

      if (userId) {
        fetchTodos();
      }
    }
  }, [userId]);

 // useEffect(() => {
  //  localStorage.setItem('todos', JSON.stringify({ todos, counter }));
  //}, [todos, counter]);

  const handleSaveTodo = (todo) => {
    if (todo.id) {
      setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === todo.id ? { ...todo, title: todo.title } : t
      )
      );
    } else {
      todo.id = counter;
      todo.userId = userId;
      setTodos((prevTodos) => [...prevTodos, todo]);
      setCounter((prevCounter) => prevCounter + 1);
    }
    setSelectedTodo(null);
  
    // Update local storage after saving todo changes
    localStorage.setItem('todos', JSON.stringify({ todos, counter }));
  };

  const handleEditTodo = (todo) => {
    setSelectedTodo(todo);
  };

  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
      setCounter(updatedTodos.length + 1);
      localStorage.setItem('todos', JSON.stringify({ todos: updatedTodos, counter: updatedTodos.length  }));
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
        return [...todos].sort((a, b) => a.title.localeCompare(b.title));
      case 'random':
        return [...todos].sort(() => Math.random() - 0.5);
      default:
        return todos;
    }
  };

  const filteredAndSortedTodos = sortTodos(
    todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
