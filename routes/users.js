const userRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);
module.exports = userRouter;
