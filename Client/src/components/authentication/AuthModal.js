import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginAuth } from '../../redux/actions';
import Modal from 'react-modal';

const AuthModal = ({ isOpen, onRequestClose, errors }) => {
    const dispatch = useDispatch();
    const [login, setlogin] = useState({ username: '', password: ''});

    const handleChange = event => {
        const { name, value } = event.target;
        setlogin(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = event => {
        event.preventDefault();
        dispatch(loginAuth(login));
    };
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Login Modal">
            <form onSubmit={handleSubmit}>
                <h1>Login Form</h1>
                <p>{errors.loginError}</p>
                <label htmlFor="username">login:</label>
                <input type="text" class="login" id="username" name="username" value={login.username} onChange={handleChange} required />
                <br />
                <label htmlFor="password">password:</label>
                <input type="password" class="password" id="password" name="password" value={login.password} onChange={handleChange} required />
                <button type="submit" class="login">Login</button>
            </form>
        </Modal>
    );
};

export default AuthModal;
