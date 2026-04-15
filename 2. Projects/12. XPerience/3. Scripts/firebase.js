// firebase.js — Firebase setup and form submission
// Replace the placeholder values below with your Firebase project config.
// Get these from: Firebase Console → Project Settings → Your apps → SDK setup

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_AUTH_DOMAIN",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Saves a form submission to the 'submissions' collection in Firestore.
// Returns the new document ID on success.
async function saveSubmission(data) {
  const docRef = await db.collection('submissions').add(data);
  return docRef.id;
}