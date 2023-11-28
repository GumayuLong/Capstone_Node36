/** @format */

import { PrismaClient } from "@prisma/client";
import { decodeToken } from "../config/jwt.js";
const prisma = new PrismaClient();

// Thông tin bình luận theo id ảnh
const getCommentBaseOnImg = async (req, res) => {
	try {
		let { imgId } = req.params;
		let data = await prisma.binh_luan.findMany({
			where: {
				hinh_id: Number(imgId),
			},
		});
		if (data.length !== 0 && data) {
			res.status(200).send(data);
		} else {
			res.status(404).send("Không có bình luận nào!");
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

// Để lưu thông tin bình luận của người dùng với hình ảnh
const saveComment = async (req, res) => {
	try {
		let { token } = req.headers;
		let dctoken = decodeToken(token);
		let { nguoi_dung_id } = dctoken.data.data;
		let infoUser = await prisma.nguoi_dung.findFirst({
			where: {
				nguoi_dung_id,
			},
		});
		if (infoUser) {
			let { imgId } = req.params;
			let { noi_dung } = req.body;
			let saveComment = {
				nguoi_dung_id,
				hinh_id: Number(imgId),
				ngay_binh_luan: new Date(),
				noi_dung,
			};
			let result = await prisma.binh_luan.create({ data: saveComment });
			res.status(201).send(result);
		} else {
			res.status(400).send("Không tồn tại user!");
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

export { getCommentBaseOnImg, saveComment };
