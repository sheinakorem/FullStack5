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
      ],
      ToDo: [
        {
          id: 1,
          ToDoName: "dishes",
          ToDoContent: "clean them please!"
        }
      ],
      posts: [
        {
          id: 1,
          postTitle: "hi",
          postContent: "hi, this is my first post",
          comments: []
        }
      ]
      
    };
  
    const storedData = JSON.parse(localStorage.getItem("myAppData"));
    if (!storedData) {
      localStorage.setItem("myAppData", JSON.stringify(initialData));
    }
  };
  