import express from "express";
import {
	createImage,
	deleteImage,
	fetchImageApi,
	getListImageByName,
	getListImageByUser,
	imageDetail,
} from "../controllers/imageController.js";
import { lockApi } from "../config/jwt.js";

const imageRoutes = express.Router();

// Danh sách ảnh về
imageRoutes.get("/list-img", fetchImageApi);

// Tìm kiếm danh sách ảnh theo tên
imageRoutes.get("/list-img-by-name/:tenHinh", getListImageByName);

// Danh sách ảnh đã tạo theo user id
imageRoutes.get("/list-img-by-user/:userId", getListImageByUser);

// Thêm một ảnh của user
imageRoutes.post("/create-image", lockApi, createImage);

// Thông tin ảnh và người tạo ảnh bằng id ảnh
imageRoutes.get("/img-detail/:imgId", imageDetail);

// Xóa ảnh đã tạo theo id ảnh
imageRoutes.delete("/img-delete", lockApi, deleteImage);

export default imageRoutes;
