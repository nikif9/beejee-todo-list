const express = require('express');
const bodyParser = require('body-parser');
const DataBaseModel = require('./db/dataBaseModel');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('config');
const {port} = config.get('server');


const app = express();
const dataBaseModel = new DataBaseModel();

app.use(bodyParser.json());
app.use(cors());
// авторизация
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
       
        const user = await dataBaseModel.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
       
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id }, 'nikif');
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
  });

app.get('/checkAuthentication', authenticateToken, (req, res) => {
    res.json({ message: 'you are loginend' });
  });

// Создание задачи
app.post('/tasks', async (req, res) => {
    try {
        const { username, email, task_text } = req.body;
        if (username.trim() == '' || task_text.trim() == '') {
            throw 'не заполнено поле';
        }
        await dataBaseModel.createTask(username.trim(), email.trim(), task_text.trim());
        res.sendStatus(201);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
// изменения задачи
app.post('/editTask', authenticateToken, async (req, res) => {
    try {
        const { task_text, id } = req.body;

        if (task_text.trim() == '' || id == '') {
            throw 'не заполнено поле';
        }

        await dataBaseModel.editTask(task_text.trim(), id);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
// завершение задачи
app.post('/completeTasks', authenticateToken, async (req, res) => {
    try {
        const { id } = req.body;

        await dataBaseModel.completeTasks(id);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Получение задач с пагинацией и сортировкой
app.get('/tasks', async (req, res) => {
    try {
        const { sortBy , sortDirection } = req.query;
        const { page = 1 } = req.query;
        
        const result = await dataBaseModel.getTasks(sortBy, sortDirection, page);
        const tasks = result.tasks;
        const pagination = result.pagination;
    
        res.json({ tasks, pagination });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
// проверка авторизации
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) {
        return res.sendStatus(401);
    }
  
    jwt.verify(token, 'nikif', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
  
        req.user = user;
        next();
    });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
