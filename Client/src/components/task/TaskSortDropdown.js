import React from 'react';

const TaskSortDropdown = ({ sortOption, setSortOption }) => {
    const handleSortChange = event => { // Добавлено
        const option = event.target.value;
        setSortOption(option);
    };

    return(
        <div className="sort-container"> {/* Добавлено */}
            <label htmlFor="sort-select">Sort:</label>
            <select id="sort-select" value={sortOption} onChange={handleSortChange}>
                <option value="default">Default</option>
                <option value="username,ASC">Username A-Z</option>
                <option value="username,DESC">Username Z-A</option>
                <option value="email,ASC">Email Z-A</option>
                <option value="email,DESC">Email Z-A</option>
                <option value="status,ASC">Status Z-A</option>
                <option value="status,DESC">Status Z-A</option>
            </select>
        </div>
    )
    
}
export default TaskSortDropdown;