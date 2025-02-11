import { Router } from "express";
import cors from "cors";
import { addRatings, fetchUserData, registerUser } from "../controller/api";
import { updateRecentlyActive } from "../repository/userCollection";

const router = Router();

const corsOptions = {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

router.use(cors());

router.post("/update-user-data", registerUser);
router.get("/fetch-user-data", fetchUserData);
router.put("/update-user-data", addRatings)
router.put("/update_recently_active", updateRecentlyActive)

export default router;
