const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'data', 'users.txt');

// Função para ler os usuários do arquivo
const readUsersFromFile = () => {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return data.split('\n').filter(line => line).map(line => JSON.parse(line));
};

// Função para escrever os usuários no arquivo
const writeUsersToFile = (users) => {
    const data = users.map(user => JSON.stringify(user)).join('\n');
    fs.writeFileSync(usersFilePath, data);
};

// GET - Retorna a lista de usuários
app.get('/users', (req, res) => {
    const users = readUsersFromFile();
    res.json(users);
});

// POST - Adiciona um novo usuário
app.post('/users', (req, res) => {
    const users = readUsersFromFile();
    const newUser = req.body;

    const userExists = users.some(user => user.id === newUser.id);
    if (userExists) {
        return res.status(400).json({ message: 'User with this ID already exists' });
    }

    users.push(newUser);
    writeUsersToFile(users);
    res.status(201).json(newUser);
});


app.put('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;

    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        writeUsersToFile(users);
        res.json(users[index]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
