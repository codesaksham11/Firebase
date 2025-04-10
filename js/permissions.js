// Function to get user permissions from Firestore
async function getUserPermissions(userId) {
    if (!userId) {
        console.log("No user ID provided for permission check.");
        return null; // No user logged in
    }

    try {
        const docRef = db.collection('userPermissions').doc(userId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            console.log("Permissions document data:", docSnap.data());
            // Return the permissions object, default missing ones to false
            const data = docSnap.data();
            return {
                canAccessTest1: data.canAccessTest1 === true, // Explicitly check for true
                canAccessTest2: data.canAccessTest2 === true
                // Add other permissions here if needed, e.g., canEnterSite: data.canEnterSite === true
            };
        } else {
            // doc.data() will be undefined in this case
            console.log("No permissions document found for user:", userId);
            return null; // Or return an object with all false: { canAccessTest1: false, canAccessTest2: false }
        }
    } catch (error) {
        console.error("Error getting permissions document:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}
