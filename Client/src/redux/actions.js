import axios from 'axios';
import configData from "../config/config.json";
console.log(configData)
export const fetchTasks = (page = 1, sortOption = 'default') => async dispatch => {
    try {
        sortOption = sortOption.split(",")
        const sortBy = sortOption[0]
        const sortDirection = sortOption[1]
        const response = await axios.get(`${configData.BACKEND_URL}/tasks?page=${page}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
        const tasks = response.data;
        
        dispatch(fetchTasksSuccess(tasks));

    } catch (error) {
        let errorText = ''
            if (error?.response?.data?.error) {
                errorText = error?.response?.data?.error
            }else{
                errorText = error.message
            }
        dispatch(fetchTasksFailure(errorText));
    }
};
const fetchTasksSuccess = (tasks) => ({
    type: "FETCH_TASKS_SUCCESS",
    payload: {
        tasks: tasks.tasks,
        pagination: tasks.pagination
    },
});
const fetchTasksFailure = (error) => ({
    type: 'FETCH_TASKS_FAILURE',
    payload: {
        error: error
    }
});

export const addTask = (task, currentPage, sortOption) => {
    return async dispatch => {
        try {
            await axios.post(`${configData.BACKEND_URL}/tasks`, task);
            dispatch(fetchTasks(currentPage, sortOption));
        } catch (error) {
            let errorText = ''
            if (error?.response?.data?.error) {
                errorText = error?.response?.data?.error
            }else{
                errorText = error.message
            }
            dispatch(updateTasksTableFailure(errorText));
        }
    };
};
export const editTask = (task, currentPage, sortOption, authToken) => {
    return async dispatch => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            await axiosInstance.post(`${configData.BACKEND_URL}/editTask`, task);
            dispatch(fetchTasks(currentPage, sortOption));
        } catch (error) {
            let errorText = ''
            if (error?.response?.data?.error) {
                errorText = error?.response?.data?.error
            }else{
                errorText = error.message
            }
            dispatch(updateTasksTableFailure(errorText));
        }
    };
};
const updateTasksTableFailure = (error) => ({
    type: 'UPDATE_TASK_TABLE_FAILURE',
    payload: { error: error }
});

export const loginAuth = (login) => {
    return async dispatch => {
        try {
            const response = await axios.post(`${configData.BACKEND_URL}/login`, login);
            localStorage.setItem("authenticationKey", response.data.token);
            dispatch(loginSuccess());

        } catch (error) {
            let errorText = ''
            if (error?.response?.data?.error) {
                errorText = error?.response?.data?.error
            }else{
                errorText = error.message
            }
            dispatch(loginFailure(errorText));
        }
    };
};
export const checkAuthentication = (authToken) => {return async dispatch => {
    try {
        const axiosInstance = axios.create({
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        
        await axiosInstance.get(`${configData.BACKEND_URL}/checkAuthentication`);
        dispatch(loginSuccess());

    } catch (error) {
       
    }
}};
const loginSuccess = () => ({
    type: 'LOGIN_SUCCESS'
});
const loginFailure = (error) => ({
    type: 'LOGIN_FAILURE',
    payload: { error: error }
});

export const logout = () => async dispatch => {
    try {
        localStorage.removeItem('authenticationKey');
        dispatch(logoutSuccess());

    } catch (error) {
       
    }
};
const logoutSuccess = () => ({
    type: 'LOGOUT_SUCCESS',
    payload: { authentication: false }
});

export const completeTasks = (authToken, id, currentPage, sortOption) => {
    return async dispatch => {
        try {
            const axiosInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            await axiosInstance.post(`${configData.BACKEND_URL}/completeTasks`, {id:id});
            dispatch(fetchTasks(currentPage,sortOption));

        } catch (error) {
            dispatch(completeTasksFailure(error.message));
        }
    };
};
const completeTasksFailure = (error) => ({
    type: 'COMPLETE_TASK_FAILURE',
    payload: { error: error }
});