import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTaskTable } from '../../redux/actions';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const TaskModal = ({ isOpen, onRequestClose, currentPage, sortOption, errors, isEdit = false, editableTask = null }) => {
    const dispatch = useDispatch();
    const [newTask, setNewTask] = useState({ id: '', username: '', email: '', task_text: '' });
    const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);
    const [buttonIsDisable, setButtonIsDisable] = useState(false);
    const [successModalText, setSuccessModalText] = useState('');

    useEffect(() => {
        if (isEdit) {
            setNewTask({ id: editableTask.id, username: editableTask.username, email: editableTask.email, task_text: editableTask.task_text });
        } else {
            setNewTask({ id: '', username: '', email: '', task_text: '' });
        }
    }, [isOpen]);
    //отлавливыаем изенения из стейта errors
    useEffect(() => {
        if (errors.updateTaskTableError == null && isOpen) {
            onRequestClose();
            setNewTask({ username: '', email: '', task_text: '' });
            if (isEdit) {
                handleOpenSuccessModal('Задача успешно изменена')
            }else{
                handleOpenSuccessModal('Задача успешно добавлено')
            }
        }
        setButtonIsDisable(false)
    }, [errors]);

    
    const handleChange = event => {
        const { name, value } = event.target;
        setNewTask(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    //обработчик для формы который срабатывает при нажатии на submit
    const formSubmitHandle = event => {
        event.preventDefault();
        if (!isEdit) {
            setButtonIsDisable(true)
            dispatch(updateTaskTable(newTask, currentPage, sortOption));
        } else {
            const authKey = localStorage.getItem('authenticationKey')
            if (editableTask.task_text !== newTask.task_text.trim()) {
                setButtonIsDisable(true)
                dispatch(updateTaskTable(newTask, currentPage, sortOption, isEdit, authKey));
            }else{
                onRequestClose();
            }
            
        }

    };
    //фнукция для показа моадального окна при успешном обновлении
    const handleOpenSuccessModal = (text) => {
        setSuccessModalText(text)
        setSuccessModalIsOpen(true);
        setTimeout(() => {
            handleCloseSuccessModal()
        }, 1000);
    };

    const handleCloseSuccessModal = () => {
        setSuccessModalText('')
        setSuccessModalIsOpen(false);
    };

    return (
        <div>
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h2> {!isEdit ? "Add Task" : "Edit Task"}</h2>
                <form onSubmit={formSubmitHandle} >
                    <h1> {errors.updateTaskTableError} </h1>
                    <label htmlFor="username">Username:</label>
                    <input type="text" disabled={isEdit} id="username" name="username" value={newTask.username} onChange={handleChange} required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" disabled={isEdit} id="email" name="email" value={newTask.email} onChange={handleChange} required />

                    <label htmlFor="task_text">Task:</label>
                    <textarea id="task_text" name="task_text" value={newTask.task_text} onChange={handleChange} required />
                    <p></p>
                    <button type="submit" disabled={buttonIsDisable}> {!isEdit ? "Add" : "Edit"}</button>
                    <button onClick={onRequestClose}>Cancel</button>
                </form>
                
            </Modal>
            <Modal isOpen={successModalIsOpen} onRequestClose={handleCloseSuccessModal}>
                <h1 className='successText'>{successModalText}</h1>
            </Modal>
        </div>

    );
};

export default TaskModal;
