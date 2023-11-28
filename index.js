import express from "express";
import rootRoutes from "./src/routes/rootRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("."));
app.use("/api", rootRoutes);
app.listen(8080);