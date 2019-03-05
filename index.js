const express = require('express');
const helmet= require('helmet');
 const cors = require('cors');
 const bcrypt = require('bcryptjs');
// Step 1 
 const session = require('express-session');

 const db= require('./database/dbConfig.js');

 const Users = require('./users/users-module');
 const server= express();
 const sessionConfig = {
     name: 'Baby Bear',
     secret: 'Keep it secret, keep it safe!',
     cookie: {
         maxAge:1000 *60*15*24, //// This is set to 24 hours 
         secure:false,
     },
     httpOnly:true,
     resave:false,
     saveUninitialized: false, 
 }

 server.use(helmet());
 server.use(express.json());
 server.use(cors());
 server.use(session(sessionConfig))// Step 2

server.get('/', (req, res) => {
    res.send("Its working!!!!!!");
})

server.post('/api/register', (req, res) => {
    let user=req.body;

    const hash= bcrypt.hashSync(user.password, 12)

    user.password= hash

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
/*
function restricted(req, res, next) {
   const {username, password} = req.headers

    if(username && password){
        Users.findBy({username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                next();
            } else{
                res.status(401).json({message: 'you shall not pass!'})
            }
        })
        .catch(error => {
            res.status(500).jason(error)
        })

    } else {
        res.status(400).json({message: "No creds provided"})
    }
}
*/
//4 new simplier restricted function

function restricted(req, res, next){
    if(req.session && req.session.username){
        next()
    } else{
        res.status(401).json({message: 'You shall not pass!'})
    }
}


server.post('/api/users', restricted, (req, res) => {
    Users.find()
    .then(users => {
        res.json(users)
    })
    .catch(err => res.send(err));
})

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));