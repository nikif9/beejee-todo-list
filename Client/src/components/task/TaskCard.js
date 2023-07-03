import React, { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { completeTasks, fetchTasks } from '../../redux/actions';
import TaskSortDropdown from './TaskSortDropdown'
import TaskModal from './TaskModal'; 
import '../style/taskCard.css';

const TaskCard = ({ tasks,  isLoggedIn, currentPage, errors}) => {
    const dispatch = useDispatch();
    
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editableTask, setEditableTask] = useState(null);
    const [sortOption, setSortOption] = useState('default');

    useEffect(() => {
        if (errors.completeTaskError != null) {
            alert('ошибка при поптыке завершить задачу: ' + errors.completeTaskError)         
        }
    }, [errors]);
    //обновяем покзываемые задачи
    useEffect(() => {
        dispatch(fetchTasks(currentPage, sortOption));
    }, [dispatch, currentPage, sortOption]);

    const handleCompleteTask = (id) => {
        const authKey = localStorage.getItem('authenticationKey')
        dispatch(completeTasks(authKey, id, currentPage, sortOption))
    };

    const handleOpenAddModal = () => {
        setIsEdit(false)
        setModalIsOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsEdit(false)
        setModalIsOpen(false);
    };

    const handleOpenEditModal = (task) => {
        setIsEdit(true)
        setEditableTask(task)
        setModalIsOpen(true);
    };


    return(
    <div>
        <TaskSortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        {errors.fetchTaskError &&  <h1> {errors.fetchTaskError} </h1>}
        <div className="task-list-container ">
            {tasks.map(task => (
                <div key={task.id} id={task.id} className={task.status ? 'task-card complete' : 'task-card'} >
                    <h4>{task.username}</h4>
                    <p>{task.email}</p>
                    <p>{task.task_text}</p>
                    {task.edited && <h5>отредактировано администратором</h5>}
                    {task.status && <h5>выполнен</h5>}
                    {!task.status ? (isLoggedIn && <button onClick={() => handleCompleteTask(task.id)}>выполнить</button>) : ''}
                    {isLoggedIn && <button onClick={() => handleOpenEditModal(task)}>Edit Task</button>}
                    
                </div>
            ))}
        </div>
        <button onClick={handleOpenAddModal}>Add Task</button>
        <TaskModal isOpen={modalIsOpen} onRequestClose={handleCloseAddModal} currentPage={currentPage} sortOption={sortOption} errors={errors} isEdit={isEdit} editableTask={editableTask} />
    </div>
    
    )
};

export default TaskCard;