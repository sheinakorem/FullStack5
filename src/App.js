import React, { useEffect } from 'react';
import { initializeLocalStorage } from './LocalStorageUtil';
import TodoList from './components/TodoList'; // Import the TodoList component
import './index.css'; // Import your CSS file

// Main App component
const App = () => {
  // useEffect hook to initialize Local Storage when the component mounts
  useEffect(() => {
    initializeLocalStorage();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="center-container">
      {/* Render the TodoList component to display the list of todos */}
      <TodoList />
    </div>
  );
};

export default App;
