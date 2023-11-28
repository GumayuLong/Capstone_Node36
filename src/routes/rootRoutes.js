import commentRoutes from "./commentRoutes.js";
import imageRoutes from "./imageRoutes.js";
import saveimgRoutes from "./saveimgRoutes.js";
import userRoutes from "./userRoutes.js";
import express from "express";

const rootRoutes = express.Router();

rootRoutes.use("/user", userRoutes);
rootRoutes.use("/image", imageRoutes);
rootRoutes.use("/comment", commentRoutes);
rootRoutes.use("/save-img", saveimgRoutes);

export default rootRoutes;
