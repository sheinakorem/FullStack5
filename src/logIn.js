import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styless.css'


const Login = () => {
    const [inputsN, setName] = useState({ name: "" });
    const [inputsP, setPass] = useState({ password: "" });

    const navigate = useNavigate();

    // the username input
    const handleChangeName = (event) => {
        const name = event.target.value;
        setName({ name: name });
    }

    // the password input
    const handleChangePass = (event) => {
        const value = event.target.value;
        setPass({ password: value });
    }

    // checking if user exists
    const handleSubmit = async (event) => {
        event.preventDefault(); 

        try {
            // fetching the users from the website
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const users = await response.json();

            // checking if user exists
            const foundUser = users.find(user => (user.username === inputsN.name ||user.name === inputsN.name )&& user.email === inputsP.password);
            if (foundUser) {
                localStorage.setItem("myData", JSON.stringify(foundUser)); // Store user data in localStorage
                navigate(`/users/${foundUser.id}`); // Navigate to user content page
            } else {
                alert("Invalid credentials. Please try again.");
            }

        } catch (error) {
            console.error('Error during login:', error);
            alert('Failed to log in. Please try again later.');
        }
    }

    return (
        <div className="form-container">
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label className="label">Username:</label>
                        <input
                            type="text"
                            name="name"
                            value={inputsN.name}
                            onChange={handleChangeName}
                            className="input"
                            required 
                        />
                    </div>
                    <div className="input-container">
                        <label className="label">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={inputsP.password}
                            onChange={handleChangePass}
                            className="input"
                            required 
                        />
                    </div>
                    <div className="button-container">
                        <input type="submit" value="Submit" className="submit-button" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
