const { Pool } = require('pg');
const config = require('config');
const {user, host, database, password, port} = config.get('db');


class DataBaseModel {
    constructor() {
        this.pool = new Pool({
            user: user,
            host: host,
            database: database,
            password: password,
            port: port,
        });
    }

    async getUserByUsername(username) {

        try {
            const query = 'SELECT id, password FROM users WHERE username = $1';
            const result = await this.pool.query(query, [username]);
            return result.rows[0];
        } catch (err) {
            console.error('Error geting Users:', err);
            throw err;
        }
    }

    async createTask(username, email, taskText) {
        try {
            const query = 'INSERT INTO tasks (username, email, task_text) VALUES ($1, $2, $3)';
            await this.pool.query(query, [username, email, taskText]);
            return true;
        } catch (err) {
            console.error('Error creating task:', err);
            throw err;
        }
    }

    async editTask(username, email, taskText, id) {
        try {
            const query = 'UPDATE tasks SET username = $1, email = $2, task_text = $3, edited = true where id = $4';
            await this.pool.query(query, [username, email, taskText, id]);
            return true;
        } catch (err) {
            console.error('Error creating task:', err);
            throw err;
        }
    }
    
    async completeTasks(id) {
        try {
            const query = 'UPDATE tasks SET status=true WHERE id = $1';
            await this.pool.query(query, [id]);
        } catch (err) {
            console.error('Error creating task:', err);
            throw err;
        }
    }


    async getTasks(sortBy, sortDirection, page = 1, pageSize = 3) {
        try {
            let totalCount = 0
            let totalPages = 1
            const offset = (page - 1) * pageSize;

            let query = 'SELECT *, (select count(*) from tasks ) FROM tasks';

            if (sortBy === 'username') {
                query += ' ORDER BY username ' + sortDirection;
            } else if (sortBy === 'email') {
                query += ' ORDER BY email ' + sortDirection;
            } else if (sortBy === 'status') {
                query += ' ORDER BY status ' + sortDirection;
            }else{
                query += ' ORDER BY id';
            }

            query += ` LIMIT ${pageSize} OFFSET ${offset}`;

            const tasksResult = await this.pool.query(query);
            const tasks = tasksResult.rows;
            

            if (tasks.length) {
                totalCount = parseInt(tasksResult.rows[0].count, 10);
                totalPages = Math.ceil(totalCount / pageSize);
            }
            

            return {
                tasks,
                pagination: {
                    totalTasks: totalCount,
                    totalPages,
                    currentPage: parseInt(page, 10),
                },
            };
        } catch (err) {
            throw err
        }
    }
}
module.exports = DataBaseModel;