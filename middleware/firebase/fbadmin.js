import admin from "firebase-admin";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
  await readFile(
    new URL(
      "../../secrets/yawudb-firebase-adminsdk-g55a2-1e0190591a.json",
      import.meta.url
    )
  )
);

export function initializeFirebase() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://yawudb.firebaseio.com",
  });
}

export async function verifyFirebaseToken(req, res, next) {
    try {
        if (req.headers.authtoken) {
            const decoded = await admin.auth().verifyIdToken(req.headers.authtoken);
            if (decoded && decoded.uid) {
                req.firebaseUID = decoded.uid;
                next();
            } else {
                return res.status(401).send('Unauthorized. Corrupted token');
            }
        } else {
            return res.status(401).send('Unauthorized. Missing valid token.');
        }
    } catch (e) {
        console.error(e);
    }
}

export async function getFirestore() {
  return admin.firestore;
}
