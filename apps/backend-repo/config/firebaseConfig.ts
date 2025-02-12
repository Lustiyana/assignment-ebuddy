// Import the functions you need from the SDKs you need
import admin, { ServiceAccount } from 'firebase-admin'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
import serviceAccount from '../serviceAccountKey.json';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
});
export const db = admin.firestore();
export const auth = admin.auth()
export default admin