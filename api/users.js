const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken')

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); 
  
});

const { getAllUsers, createUser, getUserByUsername } = require('../db');

// UPDATE
usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users
  });
});

// LOGIN
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
    const token = jwt.sign({id:user.id, username}, process.env.JWT_SECRET)
      res.send({token, message: "you're logged in!" });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;