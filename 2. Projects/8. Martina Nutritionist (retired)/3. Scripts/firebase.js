const admin = require("firebase-admin");

// Initialize Firebase Admin using environment variable
// The service account JSON should be saved as FIREBASE_SERVICE_ACCOUNT in .env
// or point to a local file path

let db;

function initFirebase() {
  if (admin.apps.length > 0) return; // Already initialized

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  db = admin.firestore();
}

async function logMeal(data) {
  initFirebase();
  await db.collection("meals").add({
    ...data,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function logWeight(kg) {
  initFirebase();
  await db.collection("weight").add({
    kg,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function getRecentMeals(limit = 20) {
  initFirebase();
  const snapshot = await db
    .collection("meals")
    .orderBy("timestamp", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getWeightHistory() {
  initFirebase();
  const snapshot = await db
    .collection("weight")
    .orderBy("timestamp", "asc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function saveConversationHistory(userId, history) {
  initFirebase();
  await db.collection("users").doc(String(userId)).set(
    { history, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
}

async function loadConversationHistory(userId) {
  initFirebase();
  const doc = await db.collection("users").doc(String(userId)).get();
  if (!doc.exists) return [];
  return doc.data().history || [];
}

async function saveProfile(userId, profile) {
  initFirebase();
  await db.collection("users").doc(String(userId)).set(
    { profile, profileUpdatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
}

async function loadProfile(userId) {
  initFirebase();
  const doc = await db.collection("users").doc(String(userId)).get();
  if (!doc.exists) return null;
  return doc.data().profile || null;
}

module.exports = { logMeal, logWeight, getRecentMeals, getWeightHistory, saveConversationHistory, loadConversationHistory, saveProfile, loadProfile };
