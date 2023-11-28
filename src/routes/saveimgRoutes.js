import express from "express";
import { lockApi } from "../config/jwt.js";
import {
	checkSavedImg,
	getListImgSaved,
} from "../controllers/saveimgController.js";

const saveimgRoutes = express.Router();

// Danh sách ảnh đã lưu theo user id
saveimgRoutes.get("/list-img-saved", lockApi, getListImgSaved);

// Thông tin đã lưu hình này chưa theo id ảnh (dùng để kiểm tra ảnh đã lưu hay chưa ở nút SAVE)
saveimgRoutes.get("/check-save/:imgId", lockApi, checkSavedImg);

export default saveimgRoutes;
