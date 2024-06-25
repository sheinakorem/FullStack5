// LocalStorageUtil.js

export const initializeLocalStorage = () => {
    const initialData = {
      users: [
        {
          id: 1,
          username: "mike",
          website: "123",
          ToDoID: 1,
          postsID: 1
        }
        // Add more users as needed
      ],
      ToDo: [
        {
          id: 1,
          ToDoName: "dishes",
          ToDoContent: "clean them please!"
        }
        // Add more todos as needed
      ],
      posts: [
        {
          id: 1,
          postTitle: "hi",
          postContent: "hi, this is my first post",
          comments: []
        }
        // Add more posts as needed
      ]
      
    };
  
    const storedData = JSON.parse(localStorage.getItem("myAppData"));
    if (!storedData) {
      localStorage.setItem("myAppData", JSON.stringify(initialData));
    }
  };
  