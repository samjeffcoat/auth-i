const express = require('express');
const helmet= require('helmet');
 const cors = require('cors');
 const bcrypt = require('bcryptjs');

 const db= require('./database/dbConfig.js');

 const Users = require('./users/users-module');
 const server= express();

 server.use(helmet());
 server.use(express.json());
 server.use(cors());

server.get('/', (req, res) => {
    res.send("Its working!!!!!!");
})

server.post('/api/register', (req, res) => {
    let user=req.body;

    const hash= bcrypt.hashSync(user.password, 12)

    Users.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(error => {
        res.status(500).json(error);
    })
})

server.post('/api/login', (req, res) => {
    let {username, password} = req.body;
    Users.findBy({username})
    .first()
    .then(user=> {
        if(user&& bcrypt.compareSync(password, user.password)){
            res.status(200).json({message: `Welcome ${user.username}!`});
        } else{
            res.status(401).json({message: 'You Shall not pass!'})
        }
    })
    .catch(error => {
        res.status(500).json(error);
    })
})


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));