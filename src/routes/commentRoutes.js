import express from "express";
import { lockApi } from "../config/jwt.js";
import {
	getCommentBaseOnImg,
	saveComment,
} from "../controllers/commentController.js";

const commentRoutes = express.Router();

// Thông tin bình luận theo id ảnh
commentRoutes.get("/comment-info/:imgId", lockApi, getCommentBaseOnImg);

// Để lưu thông tin bình luận của người dùng với hình ảnh
commentRoutes.post("/save-comment/:imgId", lockApi, saveComment);

export default commentRoutes;
