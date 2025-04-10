// This script needs to know WHICH permission it's protecting
// We'll pass the required permission key as an argument

function protectPage(requiredPermissionKey) {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // User is logged in, now check the specific permission
            console.log(`User logged in on protected page, checking permission: ${requiredPermissionKey}`);
            try {
                const permissions = await getUserPermissions(user.uid); // Use the function

                // Check if permissions exist AND the specific required permission is true
                if (permissions && permissions[requiredPermissionKey] === true) {
                    // User is authorized for THIS page
                    console.log(`Access granted for ${requiredPermissionKey}. Showing content.`);
                    document.body.style.display = ''; // Show the page content
                } else {
                    // User logged in but not authorized for THIS specific page
                    console.log(`Access DENIED for ${requiredPermissionKey}. Redirecting.`);
                    alert(`Access Denied: You do not have permission to view this page (${requiredPermissionKey}).`); // User feedback
                    window.location.href = 'test.html'; // Redirect to the main test area
                }
            } catch (error) {
                console.error(`Error checking permissions (${requiredPermissionKey}) on protected page:`, error);
                alert('Error verifying your access. Please try again later.');
                window.location.href = 'index.html'; // Redirect on error
            }
        } else {
            // User is not logged in, redirect to index
            console.log("User not logged in. Redirecting from protected page.");
             window.location.href = 'index.html';
        }
    });
}

// Simple initial hide to prevent flash of content before JS check
document.body.style.display = 'none';
