const express = require('express');
const postsRouter = express.Router();

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next(); 
  
});

const { requireUser } = require('./utils');
const { createPost } = require('../db')

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    // add authorId, title, content to postData object
    postData.authorId = req.user.id
    postData.title = title
    postData.content = content
    
   // this will create the post and the tags for us
    const post = await createPost(postData);

    // if the post comes back, res.send({ post });
    if (post){
      res.send({ post })
    }
    // otherwise, next an appropriate error object 
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;