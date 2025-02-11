import { DocumentSnapshot } from "firebase-admin/firestore";
import admin, { db, auth } from "../config/firebaseConfig";

const collectionName = 'USERS'

export const getUserData = async () => {
    try {
        const snapshot = await db.collection(collectionName).get();
        return snapshot
    } catch (error) {
        throw error
    }
}

export const addRatingsCollection = async (userId: string, body: any) => {
    try {
        const docRef = db.collection(collectionName).doc(userId);

        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            throw new Error("User not found");
        }

        await docRef.update(body);
        return { id: userId, ...body };
    } catch (error) {
        throw error;
    }
};


export const getUserDataById = async (userId: string): Promise<DocumentSnapshot | undefined> => {
    try {
        const docRef = db.collection(collectionName).doc(userId);
        const docSnap = await docRef.get();

        return docSnap.exists ? docSnap : undefined;
    } catch (error: any) {
        throw error
    }
};

interface IUserInput {
    email: string;
    password: string;
    name: string;
}

export const createNewUser = async ({ email, password, name }: IUserInput): Promise<void> => {
    try {
        const existingUser = await auth.getUserByEmail(email).catch(() => null);
        if (existingUser) {
            throw new Error("Email already exists");
        }

        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        const userUID = userRecord.uid;

        await db.collection(collectionName).doc(userUID).set({
            name,
            email,
            createdAt: new Date(),
            recentlyActive: Date.now(),
        });

    } catch (error: any) {
        throw new Error(error.message || "Failed to create user");
    }
};

export const updateRecentlyActive = async (token: string) => {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const userId = decodedToken.uid;

    await db.collection('users').doc(userId).set({
        recentlyActive: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
}