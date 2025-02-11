import express from "express";
import routes from "./routes/userRoutes";
import authMiddleware from "./middleware/authMiddleware";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/", authMiddleware, routes);

// export const api = onRequest(app)

app.listen(8080, () => {
    console.log(`🚀 Server running on http://localhost:8080`);
});