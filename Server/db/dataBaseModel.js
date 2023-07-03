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
    /**
     * получаем пользователя из таблицы users для авторизации
     *
     * @param {string} username имя/логин пользователя
     * @return {object} ассоциативный массив виде id: ид пользователя в базе данных, password:хешировыный пароль для дальнейшей сверки
     */
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
    /**
     * делаем новую запись в таблице tasks
     *
     * @param {string} username имя/логин пользователя
     * @param {string} email электроная почта пользователя
     * @param {string} taskText текст задачи
     */
    async createTask(username, email, taskText) {
        try {
            const query = 'INSERT INTO tasks (username, email, task_text) VALUES ($1, $2, $3)';
            await this.pool.query(query, [username, email, taskText]);
        } catch (err) {
            console.error('Error creating task:', err);
            throw err;
        }
    }
    /**
     * изменяем текст задачи у созданной записи tasks
     *
     * @param {string} taskText текст задачи
     * @param {integer} id ид задачи в которой будем обновлять текст
     */
    async editTask( taskText, id) {
        try {
            const query = 'UPDATE tasks SET task_text = $1, edited = true where id = $2';
            await this.pool.query(query, [taskText, id]);
            return true;
        } catch (err) {
            console.error('Error creating task:', err);
            throw err;
        }
    }
    /**
     * изменяем поле status на ture для задач чтобы их завершить
     *
     * @param {integer} id ид задачи в которой будем обновлять поле status
     */
    async completeTasks(id) {
        try {
            const query = 'UPDATE tasks SET status=true WHERE id = $1';
            await this.pool.query(query, [id]);
        } catch (err) {
            console.error('Error creating task:', err);
            throw err;
        }
    }

    /**
     * получаем данные из таблицы tasks для их последующей отрисовки с пагинацией
     *
     * @param {string} sortBy тип сортировки возможны 3 варианта username, email, status остальные не будут работать 
     * @param {string} sortDirection направление сортировки есть 2 варианта ASC и DESC
     * @param {integer} page номер страницы какой мы будем показывать
     * @param {integer} pageSize количество элементов на одной странице 
     */
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