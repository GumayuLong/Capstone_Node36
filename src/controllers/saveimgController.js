import { PrismaClient } from "@prisma/client";
import { decodeToken } from "../config/jwt.js";
const prisma = new PrismaClient();

// Danh sách ảnh đã lưu theo user id
const getListImgSaved = async (req, res) => {
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
			let data = await prisma.luu_anh.findMany({
				where: {
					nguoi_dung_id,
				},
			});
			if(data.length !== 0) {
				res.status(200).send(data);
			} else {
				res.status(400).send("Chưa lưu ảnh nào!");
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
		let dctoken = decodeToken(token);
		let { nguoi_dung_id } = dctoken.data.data;
		let infoUser = await prisma.nguoi_dung.findFirst({
			where: {
				nguoi_dung_id,
			},
		});
		if (infoUser) {
			let { imgId } = req.params;
			let checkSaved = await prisma.luu_anh.findFirst({
				where: {
					nguoi_dung_id,
					hinh_id: Number(imgId),
				},
			});
			if (checkSaved) {
				res.send("Đã lưu");
				return true;
			} else {
				res.send("Lưu ?");
				return false;
			}
		} else {
			res.status(400).send("Không tồn tại user!");
			return;
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

export { getListImgSaved, checkSavedImg };
