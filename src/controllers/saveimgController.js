/** @format */

import { PrismaClient } from "@prisma/client";
import { decodeToken } from "../config/jwt.js";
const prisma = new PrismaClient();

// Danh sách ảnh đã lưu theo user id
const getListImgSaved = async (req, res) => {
	try {
		let { userId } = req.params;
		let infoUser = await prisma.nguoi_dung.findFirst({
			where: {
				nguoi_dung_id: Number(userId),
			},
		});
		if (infoUser) {
			let data = await prisma.luu_anh.findMany({
				where: {
					nguoi_dung_id: Number(userId),
				},
			});
			if (data.length !== 0) {
				res.status(200).send(data);
			} else {
				res.status(400).send("User này chưa lưu ảnh nào!");
			}
		} else {
			res.status(400).send("Không tồn tại user!");
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

// Thông tin đã lưu hình này chưa theo id ảnh (dùng để kiểm tra ảnh đã lưu hay chưa ở nút SAVE)
const checkSavedImg = async (req, res) => {
	try {
		let { token } = req.headers;
		let { userid } = req.headers;
		let dctoken = decodeToken(token);
		let { nguoi_dung_id } = dctoken.data.data;
		let infoUser = await prisma.nguoi_dung.findFirst({
			where: {
				nguoi_dung_id,
			},
		});
		if (infoUser) {
			let { imgId } = req.params;
			let checkId = await prisma.nguoi_dung.findFirst({
				where: {
					nguoi_dung_id: Number(userid),
				},
			});
			if (checkId) {
				let checkHinh = await prisma.hinh_anh.findFirst({
					where: {
						hinh_id: Number(imgId),
					},
				});
				if (checkHinh) {
					let checkSaved = await prisma.luu_anh.findFirst({
						where: {
							nguoi_dung_id: Number(userid),
							hinh_id: Number(imgId),
						},
					});
					if (checkSaved) {
						res.status(200).send("Đã lưu");
						return true;
					} else {
						res.send(
							"Người dùng này chưa lưu hình này, Bạn có muốn lưu hình?"
						);
						return false;
					}
				} else {
					res.status(404).send("Id hình này không tồn tại");
				}
			} else {
				res.status(404).send("Id user không tồn tại!");
			}
		} else {
			res.status(400).send("Không có quyền truy cập!");
			return;
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

export { getListImgSaved, checkSavedImg };
