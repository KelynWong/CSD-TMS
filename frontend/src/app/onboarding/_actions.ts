"use server";

// Import necessary modules for authentication and Clerk client
import { auth, clerkClient } from "@clerk/nextjs/server";

// Function to complete the onboarding process for a user
export const completeOnboarding = async (formData: FormData) => {
	// Retrieve the user ID from the authentication context
	const { userId } = auth();

	// Check if a user is logged in
	if (!userId) {
		return { message: "No Logged In User" };
	}

	// Attempt to update the user's metadata to mark onboarding as complete
	try {
		await clerkClient().users.updateUser(userId, {
			publicMetadata: {
				// Mark onboarding as complete
				onboardingComplete: true,
				// Update user's gender from the form data
				gender: formData.get("gender"),
				// Update user's country from the form data
				country: formData.get("country"),
				// Set the user's role to "PLAYER"
				role: "PLAYER",
			},
		});
		// Return a success message if the update is successful
		return { message: "User metadata Updated" };
	} catch (e) {
		// Return an error message if the update fails
		return { message: "Error Updating User Metadata" };
	}
};
