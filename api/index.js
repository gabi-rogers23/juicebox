const express = require('express');
const apiRouter = express.Router();

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const allPostsRouter = require('./posts');
apiRouter.use('/posts', allPostsRouter)

const tagsRouter = require('./tags');
apiRouter.use('/tags', tagsRouter)

module.exports = apiRouter;