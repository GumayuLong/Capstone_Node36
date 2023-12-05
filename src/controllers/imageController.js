/** @format */

import { PrismaClient } from "@prisma/client";
import { decodeToken } from "../config/jwt.js";
const prisma = new PrismaClient();

// Danh sách ảnh về
const fetchImageApi = async (req, res) => {
	try {
		let data = await prisma.hinh_anh.findMany();
		res.status(200).send(data);
	} catch (err) {
		res.status(400).send(err);
	}
};

// Tìm kiếm danh sách ảnh theo tên
const getListImageByName = async (req, res) => {
	try {
		let { tenHinh } = req.params;
		let listImg = await prisma.hinh_anh.findMany({
			where: {
				ten_hinh: {
					contains: tenHinh,
				},
			},
		});
		if (listImg.length !== 0) {
			res.status(200).send(listImg);
		} else {
			res.status(404).send("Không tìm thấy ảnh!");
		}
	} catch (err) {
		res.status(404).send(err);
	}
};

// Thêm một ảnh của user
const createImage = async (req, res) => {
	let { ten_hinh, duong_dan, mo_ta, nguoi_dung_id } = req.body;
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
			let newImage = {
				ten_hinh,
				duong_dan,
				mo_ta,
				nguoi_dung_id: req.body.nguoi_dung_id,
			};
			let result = await prisma.hinh_anh.create({ data: newImage });
			res.status(200).send(result);
			return;
		} else {
			res.send("Không có quyền truy cập!");
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

// Danh sách ảnh đã tạo theo user id
const getListImageByUser = async (req, res) => {
	try {
		let { userId } = req.params;
		let infoUser = await prisma.nguoi_dung.findFirst({
			where: {
				nguoi_dung_id: Number(userId),
			},
		});
		if (infoUser) {
			let data = await prisma.hinh_anh.findMany({
				where: {
					nguoi_dung_id: Number(userId),
				},
			});
			res.status(200).send(data);
		} else {
			res.send("Không tồn tại user");
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

// Thông tin ảnh và người tạo ảnh theo id ảnh
const imageDetail = async (req, res) => {
	try {
		let { imgId } = req.params;
		let data = await prisma.hinh_anh.findFirst({
			where: {
				hinh_id: Number(imgId),
			},
			include: {
				nguoi_dung: true,
			},
		});
		if (data) {
			res.status(200).send(data);
		} else {
			res.status(404).send("Ảnh không tồn tại");
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

// Xóa ảnh đã tạo theo id ảnh
const deleteImage = async (req, res) => {
	try {
		let { idhinh } = req.headers;
		let { token } = req.headers;
		let dctoken = decodeToken(token);
		let { nguoi_dung_id } = dctoken.data.data;
		let infoUser = await prisma.nguoi_dung.findFirst({
			where: {
				nguoi_dung_id,
			},
			include: {
				hinh_anh: true,
			},
		});
		if (infoUser) {
			const deleteImg = await prisma.hinh_anh.delete({
				where: {
					hinh_id: Number(idhinh),
				},
			});
			if (deleteImg) {
				res.status(200).send(
					`Xóa hình ${deleteImg.ten_hinh} thành công`
				);
			} else {
				res.status(400).send("Hình không tồn tại!");
			}
		} else {
			res.status(400).send("Không có quyền truy cập!");
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

export {
	fetchImageApi,
	getListImageByName,
	createImage,
	getListImageByUser,
	imageDetail,
	deleteImage,
};
