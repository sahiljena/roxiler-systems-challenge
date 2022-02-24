const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes add here

app.get('/',(req, res)=>{
    res.send(`Its working on PORT ${PORT}`)
})

app.get('/todos', async (req, res)=>{

    const apiTodoData = await axios.get('https://jsonplaceholder.typicode.com/todos');
    const response = apiTodoData.data;
    const respWihtoutUserId = response.map(({userId, ...rest}) => {
        return rest;
    });
    res.send(respWihtoutUserId);
})

app.get('/user/:id', async (req, res)=>{
    const userId = req.params.id;
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const userData = response.data;
    
    const todos = await axios.get('https://jsonplaceholder.typicode.com/todos');
    const userTodos = todos.data.filter((todo)=>{
        //console.log(todo["userId"]);
        return todo["userId"] == userId;
    })

    userData["todos"] = userTodos;

    res.send(userData);
})

//Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
        status: err.status || 500,
        message: err.message
        }
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT + '...');
});