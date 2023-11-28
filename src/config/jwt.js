import jwt from "jsonwebtoken";

const createToken = (data) => {
	let token = jwt.sign({ data }, "capstone", { expiresIn: "5h" });
	return token;
};

// const createAccessToken = (data) => {
// 	let accessToken = jwt.sign({ data }, "accessToken", { expiresIn: "5y" });
// 	return accessToken;
// }

const checkToken = (token) => {
	return jwt.verify(token, "capstone");
};

const decodeToken = (token) => {
	return jwt.decode(token);
};

const lockApi = (req, res, next) => {
	let { token } = req.headers;
	if (token) {
		if (checkToken(token)) {
			console.log(decodeToken);
		} else {
			res.status(401).send("accessToken không hợp lệ");
		}
		next();
	} else {
		res.status(401).send("Không có quyền truy cập vào API");
	}
};

export { createToken, checkToken, decodeToken, lockApi };
