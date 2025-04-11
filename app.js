// --- START: PASTE YOUR FIREBASE CONFIG HERE ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
// --- END: PASTE YOUR FIREBASE CONFIG HERE ---

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const fileLinksDiv = document.getElementById('file-links');
const errorMessageDiv = document.getElementById('error-message');

// Google Auth Provider
const provider = new firebase.auth.GoogleAuthProvider();

// --- Authentication ---

loginBtn.onclick = () => {
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Login successful:", result.user);
            // User is signed in. Handled by onAuthStateChanged
        })
        .catch((error) => {
            console.error("Login error:", error);
            errorMessageDiv.textContent = `Login failed: ${error.message}`;
        });
};

logoutBtn.onclick = () => {
    auth.signOut();
};

// Listen for Auth state changes
auth.onAuthStateChanged(user => {
    errorMessageDiv.textContent = ''; // Clear errors on auth change
    if (user) {
        // User is signed in
        userInfo.textContent = `Logged in as: ${user.email} (UID: ${user.uid})`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        fileLinksDiv.style.display = 'block'; // Show file access buttons
    } else {
        // User is signed out
        userInfo.textContent = 'Not logged in';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        fileLinksDiv.style.display = 'none'; // Hide file access buttons
    }
});

// --- File Access Logic ---

async function accessFile(fileName) {
    errorMessageDiv.textContent = ''; // Clear previous errors
    const user = auth.currentUser;

    if (!user) {
        errorMessageDiv.textContent = "You must be logged in to access files.";
        return;
    }

    console.log(`Attempting to access ${fileName} for user ${user.uid}`);

    try {
        // 1. Check Firestore for permission
        const permissionDocRef = db.collection('filePermissions').doc(fileName);
        const permissionDoc = await permissionDocRef.get();

        if (!permissionDoc.exists) {
            console.log(`Permission document for ${fileName} does not exist.`);
            errorMessageDiv.textContent = `Access Denied: File configuration not found.`;
            return;
        }

        const permissions = permissionDoc.data();
        const allowedUsers = permissions.allowedUsers || []; // Ensure array exists

        if (!allowedUsers.includes(user.uid)) {
            console.log(`User ${user.uid} not found in allowedUsers for ${fileName}.`);
            errorMessageDiv.textContent = `Access Denied: You do not have permission to access ${fileName}.`;
            return;
        }

        // 2. If permission granted, get the file from Cloud Storage
        console.log(`User ${user.uid} has permission for ${fileName}. Fetching URL...`);
        // IMPORTANT: Path in Storage must match the Security Rule path!
        const fileRef = storage.ref(`protected/${fileName}`); // Assuming files are in a 'protected' folder
        const downloadUrl = await fileRef.getDownloadURL();

        console.log(`Got download URL for ${fileName}. Redirecting...`);
        // Redirect the user to the file
        window.location.href = downloadUrl;
        // Alternatively, you could fetch the content and display it within the page
        // for a Single Page App (SPA) feel, but redirect is simpler here.

    } catch (error) {
        console.error(`Error accessing file ${fileName}:`, error);
        if (error.code === 'storage/object-not-found') {
             errorMessageDiv.textContent = `Error: The file ${fileName} was not found in storage.`;
        } else if (error.code === 'storage/unauthorized') {
             // This *should* be caught by the Firestore check, but acts as a backup
             errorMessageDiv.textContent = `Access Denied: You do not have permission (checked via Storage Rules).`;
        } else if (error.code === 'permission-denied') {
             // This likely means Firestore rules denied reading the permission doc
              errorMessageDiv.textContent = `Access Denied: Could not verify permissions.`;
        }
         else {
            errorMessageDiv.textContent = `An error occurred: ${error.message}`;
        }
    }
}

// Make accessFile globally available (since it's called via onclick)
window.accessFile = accessFile;
