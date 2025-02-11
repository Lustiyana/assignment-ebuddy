import { Request, Response, NextFunction } from "express";
import admin from "../config/firebaseConfig";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = admin.auth().verifyIdToken(token);

        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
        return;
    }
};

export default authMiddleware;
