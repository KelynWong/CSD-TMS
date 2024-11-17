"use server";

import { clerkClient } from "@clerk/nextjs/server";

// This file contains actions related to user management in the admin panel.

// Function to update user profile
export const updateUser = async (userId: string, formData: FormData) => {
	if (!userId) {
		return { message: "No Logged In User" };
	}
	// Get user data
	const user = await clerkClient().users.getUser(userId);

	// Check if the profile picture is a placeholder
	const base64String = formData.get("profilePicture");
	const isProfilePicturePlaceholder = base64String.startsWith("https://");

	// Get first name and last name from full name
	const fullname = formData.get("fullname");
	const names = fullname.split(" ");
	const firstName = names[0];
	const lastName = names.slice(1).join(" ");

	// Create file from base64 string
	if (!isProfilePicturePlaceholder) {
		const cleanBase64String = base64String.replace(
			/^data:image\/\w+;base64,/,
			""
		);
		const binaryString = atob(cleanBase64String);
		const binaryData = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			binaryData[i] = binaryString.charCodeAt(i);
		}
		const fileBits = [binaryData];
		const fileName = formData.get("username") + ".png";
		const file = new File(fileBits, fileName, { type: "image/png" });
		const params = {
			file,
		};
        
        // Update user profile image
        try {
            const response = await clerkClient().users.updateUserProfileImage(
                userId,
				params
			);
            
        } catch (e) {
            return { error: e, message: "Error Updating User Profile Image" };
        }
    }

    try {
		// Update user data
		const response1 = await clerkClient().users.updateUser(userId, {
			firstName: firstName,
            lastName: lastName,
			username: formData.get("username"),
			publicMetadata: {
				onboardingComplete: true,
				role: formData.get("role"),
				gender: formData.get("gender"),
				country: formData.get("country"),
			},
		});   
		return { message: "User metadata Updated" };
	} catch (e) {
		return { error: e, message: "Error Updating User Metadata" };
	}
};

// Function to delete user
export const deleteUser = async (userId: string) => {
	try {
		await clerkClient().users.deleteUser(userId);
		return { message: "User Deleted" };
	} catch (e) {
		return { error: e, message: "Error Deleting User" };
	}
};
