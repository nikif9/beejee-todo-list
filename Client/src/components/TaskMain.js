import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, checkAuthentication } from '../redux/actions';
import ReactPaginate from 'react-paginate';
import AuthButton from './authentication/AuthButton';
import TaskCard from './task/TaskCard';
import './style/taskMain.css';
import './style/modal.css';

const TaskMain = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 

    const tasks = useSelector(state => state.tasks);
    const pagination = useSelector(state => state.pagination);
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const errors = useSelector(state => state.errors);
    //проверка на авторизацию
    useEffect(() => {
        const authKey = localStorage.getItem('authenticationKey')
        if (authKey) {
            dispatch(checkAuthentication(authKey))
        }
    }, []);

    useEffect(() => {
        if (pagination) {
            setTotalPages(pagination.totalPages);
        } 
    }, [tasks,pagination]);

    const handlePageChange = page => {
        setCurrentPage(page.selected + 1);
    };

    
    
    return (
        <div>
            <div className="auth-button-container">
                <AuthButton isLoggedIn={isLoggedIn} errors={errors}  />
            </div>
            <h2>Tasks</h2>  
            <TaskCard tasks={tasks} isLoggedIn={isLoggedIn} currentPage={currentPage} errors={errors} />
            <ReactPaginate
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                nextClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextLinkClassName={'page-link'}
            />
        </div>
    );
};

export default TaskMain;
