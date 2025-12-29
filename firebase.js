// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAP7lzXcSwmkOk88rXIx77j8s4gsfUs6k0",
  authDomain: "unews-4db42.firebaseapp.com",
  databaseURL: "https://unews-4db42-default-rtdb.firebaseio.com",
  projectId: "unews-4db42",
  storageBucket: "unews-4db42.firebasestorage.app",
  messagingSenderId: "382914552995",
  appId: "1:382914552995:web:ca6f2c0f6a250c39fc4b16",
  measurementId: "G-38CHL8F98F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Login anonymous otomatis
signInAnonymously(auth)
  .then(() => console.log("✅ Anonymous login success"))
  .catch(error => console.error("Anonymous login error:", error));

export { database, auth, ref, set, get, update };
