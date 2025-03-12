import admin from "firebase-admin";
import serviceAccount from "../configs/firebase-service-account.json" assert { type: "json" };
;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;
