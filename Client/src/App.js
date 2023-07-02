import React from 'react';
import { Provider } from 'react-redux';
import TaskMain from './components/TaskMain';
import store from './redux/store';

const App = () => {
    
    return (
        <Provider store={store}>
            <div className="App">
                <TaskMain />
            </div>
        </Provider>
    );
};

export default App;
