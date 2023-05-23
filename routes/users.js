const userRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateUser);
module.exports = userRouter;
