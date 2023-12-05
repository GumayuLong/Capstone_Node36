import express from 'express';
import { login, signUp, updateUser, userInfo } from '../controllers/userController.js';
import { lockApi } from '../config/jwt.js';

const userRoutes = express.Router();

userRoutes.post("/login", login);
userRoutes.post("/signUp", signUp);
userRoutes.get("/user-info", userInfo);
userRoutes.put("/update-user/:id", lockApi, updateUser);

export default userRoutes;