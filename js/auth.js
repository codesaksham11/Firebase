const loginButton = document.getElementById('login-google');
const logoutButton = document.getElementById('logout');
const loginSection = document.getElementById('login-section');
const loggedInSection = document.getElementById('logged-in-section');
const userEmailSpan = document.getElementById('user-email');
const loginError = document.getElementById('login-error');
const enterSitePlaceholder = document.getElementById('enter-site-placeholder');

// --- Login ---
loginButton.addEventListener('click', () => {
    loginError.textContent = ''; // Clear previous errors
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            console.log("Login successful:", result.user);
            // Auth state listener will handle UI changes
        })
        .catch((error) => {
            console.error("Login error:", error);
            loginError.textContent = `Login failed: ${error.message}`;
        });
});

// --- Logout ---
logoutButton.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log("Logout successful");
            // Auth state listener will handle UI changes
        })
        .catch((error) => {
            console.error("Logout error:", error);
        });
});

// --- Auth State Listener ---
auth.onAuthStateChanged(async (user) => {
    enterSitePlaceholder.innerHTML = ''; // Clear placeholder content

    if (user) {
        // User is signed in
        console.log("User state changed: Logged in", user.uid, user.email);
        loginSection.style.display = 'none';
        loggedInSection.style.display = 'block';
        userEmailSpan.textContent = user.email;

        // --- CHECK PERMISSIONS ---
        // Check if the user has *any* basic permission to enter the site at all.
        // You might define a specific permission like 'canEnterSite' in Firestore,
        // or just check if they have permission for test1 OR test2.
        // For this example, we'll allow entry if they have access to *either* test1 or test2.
        try {
            const permissions = await getUserPermissions(user.uid); // From permissions.js
            console.log("User Permissions:", permissions);

            if (permissions && (permissions.canAccessTest1 || permissions.canAccessTest2)) {
                 // User is authorized to enter the main test area
                 const enterButton = document.createElement('a'); // Use <a> for navigation
                 enterButton.href = 'test.html';
                 enterButton.textContent = 'Enter Site';
                 enterButton.classList.add('button'); // Optional styling class
                 enterSitePlaceholder.appendChild(enterButton);
            } else {
                // User is logged in but NOT authorized for any section
                const message = document.createElement('p');
                message.textContent = "Your account is pending verification for site access.";
                message.style.color = 'orange';
                enterSitePlaceholder.appendChild(message);
                console.log("User logged in but lacks permissions to enter site.");
            }
        } catch (error) {
            console.error("Error checking permissions:", error);
            const errorMsg = document.createElement('p');
            errorMsg.textContent = "Could not verify your access permissions. Please try again later.";
            errorMsg.style.color = 'red';
            enterSitePlaceholder.appendChild(errorMsg);
        }

    } else {
        // User is signed out
        console.log("User state changed: Logged out");
        loginSection.style.display = 'block';
        loggedInSection.style.display = 'none';
        userEmailSpan.textContent = '';
        loginError.textContent = ''; // Clear login errors on logout
    }
});
