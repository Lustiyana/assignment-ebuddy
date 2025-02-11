import { Request, Response } from "express";
import { addRatingsCollection, createNewUser, getUserData, getUserDataById, updateRecentlyActive } from "../repository/userCollection";
import { DocumentSnapshot } from "firebase-admin/firestore";
import { convertIsoDateToUnixAndFormat } from "../libs/convertIsoDateToUnixAndFormat";
import { TDataUser } from "@shared/interfaces"


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        await createNewUser({ email, password, name })

        res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};



export const addRatings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { rating, userId } = req.body;

        const docSnap: DocumentSnapshot | undefined = await getUserDataById(userId);

        if (!docSnap || !docSnap.exists) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const dataUser = docSnap.data() as TDataUser;

        const numberOfRents = (dataUser.numberOfRents || 0) + 1;
        const previousTotalRatings = (dataUser.totalAverageWeightRatings || 0) * (dataUser.numberOfRents || 0);
        const totalAverageWeightRatings = (previousTotalRatings + rating) / numberOfRents;

        const payload: TDataUser = {
            numberOfRents,
            totalAverageWeightRatings
        };

        const docRef = await addRatingsCollection(userId, payload);

        res.status(201).json(docRef);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const fetchUserData = async (req: Request, res: Response): Promise<void> => {
    try {
        const snapshot = await getUserData();

        const items = await Promise.all(snapshot.docs.map(async (doc) => {
            if (!doc.exists) return null;

            const data = doc.data() as TDataUser;
            const { totalAverageWeightRatings, numberOfRents, recentlyActive } = data;

            const formattedTime = convertIsoDateToUnixAndFormat(recentlyActive as string);

            const docSnap: DocumentSnapshot | undefined = await getUserDataById(doc.id);

            if (!docSnap) return null;

            return {
                id: doc.id,
                email: docSnap.get("email"),
                name: docSnap.get("name"),
                totalAverageWeightRatings: totalAverageWeightRatings !== undefined
                    ? parseFloat(totalAverageWeightRatings.toFixed(1))
                    : 0,
                numberOfRents: numberOfRents || 0,
                recentlyActive: formattedTime
            };
        }));

        const sortedItems = items
            .filter((item): item is { id: string; email: string; name: string; totalAverageWeightRatings: number; numberOfRents: number; recentlyActive: string } => item !== null)
            .sort((a, b) => b.totalAverageWeightRatings - a.totalAverageWeightRatings);

        res.status(200).json(sortedItems);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const updateActivity = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        updateRecentlyActive(token as string)

        res.status(200).send('Activity updated');
    } catch (error) {
        res.status(500).send('Error updating activity');
    }
}