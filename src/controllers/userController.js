import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import { createToken, decodeToken } from "../config/jwt.js";

// Login
const login = async (req, res) => {
	let { email, mat_khau } = req.body;
	try {
		let checkEmail = await prisma.nguoi_dung.findFirst({
			where: {
				email,
			},
		});
		if (checkEmail) {
			let checkPassword = bcrypt.compareSync(
				mat_khau,
				checkEmail.mat_khau
			);
			if (checkPassword) {
				let token = createToken({ data: checkEmail });
				res.send(`Token user: ${token}`);
				return;
			} else {
				res.status(400).send("Email hoặc password không đúng!");
				return;
			}
		}
		res.status(200).send("Login thành công");
	} catch (err) {
		res.status(400).send(err);
	}
};

// SignUp
const signUp = async (req, res) => {
	let { ho_ten, email, mat_khau, tuoi } = req.body;
	try {
		let data = await prisma.nguoi_dung.findFirst({
			where: {
				email,
			},
		});
		if (!data) {
			let hashpassword = bcrypt.hashSync(mat_khau, 10);
			let newData = {
				email,
				mat_khau: hashpassword,
				ho_ten,
				tuoi,
				anh_dai_dien: "",
			};

			let result = await prisma.nguoi_dung.create({ data: newData });
			res.status(201).send(result);
			return;
		} else {
			res.status(400).send("Email đã tồn tại!");
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

// Thông tin user
const userInfo = async (req, res) => {
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
			res.status(200).send(infoUser);
		} else {
			res.status(400).send("Không tồn tại user!");
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

// Chỉnh sửa thông tin user
const updateUser = async (req, res) => {
	let { ho_ten, mat_khau, tuoi, anh_dai_dien } = req.body;
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
			let hidePassword = bcrypt.hashSync(mat_khau, 5);
			let updateData = {
				...infoUser,
				mat_khau: hidePassword,
				ho_ten,
				tuoi,
				anh_dai_dien,
			};
			let update = await prisma.nguoi_dung.update({
				where: {
					nguoi_dung_id,
				},
				data: updateData,
			});
			res.status(200).send(update);
		} else {
			res.status(400).send("Không tồn tại user!");
		}
		res.status(200).send("Update thành công");
	} catch (err) {
		res.status(400).send(err);
	}
};

export { userInfo, login, signUp, updateUser };
