// IMPORTANT: Replace with your actual Firebase configuration!
const firebaseConfig = {
  apiKey: "AIzaSyAkD3--Zh9-FbKOqcOqPWVAadiOkrBzF2Y",
  authDomain: "model-test-5acd2.firebaseapp.com",
  projectId: "model-test-5acd2",
  storageBucket: "model-test-5acd2.firebasestorage.app",
  messagingSenderId: "662007935007",
  appId: "1:662007935007:web:019c2711dcbf8a319c652a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services for other scripts to use
const auth = firebase.auth();
const db = firebase.firestore(); // Make sure Firestore SDK is included in HTML
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Optional: If using modular v9 SDK (recommended but different syntax)
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js";
// import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js";
// import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js";
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const googleProvider = new GoogleAuthProvider();
// export { auth, db, googleProvider, onAuthStateChanged, signInWithPopup, signOut, doc, getDoc };
