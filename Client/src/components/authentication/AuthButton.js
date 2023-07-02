import React, {useEffect, useState } from 'react';
import { logout } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import AuthModal from './AuthModal';

const AuthButton = ({ isLoggedIn, errors }) => {
    const dispatch = useDispatch();

    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            closeModal()
        }
    }, [isLoggedIn]);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout())
    };
    if (isLoggedIn) {
        return <button onClick={handleLogout}>Logout</button>;
    } else {
        return (
            <div>
                <button onClick={openModal}>Login</button>
                <AuthModal isOpen={modalIsOpen} onRequestClose={closeModal} errors={errors} />
            </div>
        );
  }
};

export default AuthButton;