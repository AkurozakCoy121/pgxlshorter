// firebase.js
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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

console.log("🔥 Firebase connected");
