const express = require('express');
const helmet= require('helmet');
 const cors = require('cors');
 const bcrypt = require('bcryptjs');

 const db= require('./database/dbUsers.js');

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));