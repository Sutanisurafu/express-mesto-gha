const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getEnteredUserInfo,
} = require('../controllers/users');
const { userIdValidate } = require('../middlewares/validators')

userRouter.get('/me', getEnteredUserInfo);
userRouter.get('/', getUsers);
userRouter.get('/:userId', userIdValidate, getUserById);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);
module.exports = userRouter;
