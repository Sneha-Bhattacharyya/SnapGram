import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import { setupSwagger } from "./utils/swagger";
dotenv.config();

const app = express();
app.use(express.json());
setupSwagger(app);
app.use(cors());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);


app.get("/", (req, res) => {
    res.send("Server Started Successfully");
}
);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});