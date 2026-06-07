const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

const ADMIN_EMAIL = "admin@jeel2010.com";
const ADMIN_PASSWORD = "Admin@12345";

async function createAdmin() {
  let userRecord;

  try {
    userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
    console.log("Admin user already exists:", userRecord.uid);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      userRecord = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        displayName: "مسؤول المنصة",
        emailVerified: true,
      });

      console.log("Admin user created:", userRecord.uid);
    } else {
      throw error;
    }
  }

  const uid = userRecord.uid;
  const now = new Date().toISOString();

  await db.collection("users").doc(uid).set(
    {
      uid,
      name: "مسؤول المنصة",
      email: ADMIN_EMAIL,
      role: "admin",
      subscriptionStatus: "active",
      subscriptionPlan: "admin",
      isActive: true,
      joinedVipGroups: true,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  console.log("Admin Firestore document created/updated:", uid);
  console.log("Email:", ADMIN_EMAIL);
  console.log("Password:", ADMIN_PASSWORD);
}

createAdmin()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error creating admin:", error);
    process.exit(1);
  });