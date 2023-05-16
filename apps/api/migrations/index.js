import { getFirestore } from "../middleware/firebase/fbadmin.js";
import { users } from "../utils/db.js";


export async function migrateUsers() {
    try {
        const firestore = await getFirestore();
        const usersSnapshot = await firestore().collection('users').get();
        
        usersSnapshot.forEach(async doc => {
            const data = doc.data();

            const user = {
                displayName: data.displayName,
                role: ["USER"],
                fuid: doc.id,
            }

            if (data.avatar.includes("/")) {
                const [icon] = data.avatar.split("/").slice(-1);
                const a = icon.split('-icon.png')[0];
                user.avatar = a;
            } else {
                user.avatar = data.avatar;
            }
    
            // const r = await users().updateOne({ fuid: doc.id }, { $set: user }, { upsert: true });
            // console.log(r);
        })
      } catch(e) {
        console.error(e)
      }
    
}