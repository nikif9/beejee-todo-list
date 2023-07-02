const initialState = {
    tasks: [],
    pagination: null,
    errors: {
        updateTaskTableError: null,
        loginError: null,
        fetchTaskError: null,
        completeTaskError: null
    },
    isLoggedIn: false
};

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_TASKS_SUCCESS':
            return {
                ...state,
                tasks: action.payload.tasks,
                pagination: action.payload.pagination,
                errors: {
                    updateTaskTableError: null,
                    loginError: null,
                    fetchTaskError: null,
                    completeTaskError: null
                },
            };
        case 'FETCH_TASKS_FAILURE':
            return {
                ...state,
                tasks: [],
                errors: {
                    updateTaskTableError: null,
                    loginError: null,
                    fetchTaskError: action.payload.error,
                    completeTaskError: null
                },
            };
        case 'UPDATE_TASK_TABLE_FAILURE':
            return {
                ...state,
                errors: {
                    updateTaskTableError: action.payload.error,
                    loginError: null,
                    fetchTaskError: null,
                    completeTaskError: null
                },
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isLoggedIn: true,
                errors: {
                    updateTaskTableError: null,
                    loginError: null,
                    fetchTaskError: null,
                    completeTaskError: null
                }
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                errors: {
                    updateTaskTableError: null,
                    loginError: action.payload.error,
                    fetchTaskError: null,
                    completeTaskError: null
                }
            };
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                isLoggedIn: false,
                errors: {
                    updateTaskTableError: null,
                    loginError: null,
                    fetchTaskError: null,
                    completeTaskError: null
                }
            };
        case 'COMPLETE_TASK_FAILURE':
            return {
                ...state,
                errors: {
                    updateTaskTableError: null,
                    loginError: null,
                    fetchTaskError: null,
                    completeTaskError: action.payload.error
                }
            };
        default:
            return state;
    }
};

export default taskReducer;
