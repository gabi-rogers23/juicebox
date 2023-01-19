
const express = require('express');
const allPostsRouter = express.Router();

allPostsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next(); 
  
});

const { getAllPosts } = require('../db');

allPostsRouter.get('/', async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts
  });
});


module.exports = allPostsRouter;