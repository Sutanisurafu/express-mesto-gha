const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getEnteredUserInfo,
} = require('../controllers/users');

userRouter.get('/me', getEnteredUserInfo);
userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);
module.exports = userRouter;
