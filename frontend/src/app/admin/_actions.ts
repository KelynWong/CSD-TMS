"use server";

import { clerkClient } from "@clerk/nextjs/server";


// update user
export const updateUser = async (userId: string, formData: FormData) => {
	if (!userId) {
		return { message: "No Logged In User" };
	}
	// get user
	const user = await clerkClient().users.getUser(userId);

	const base64String = formData.get("profilePicture");
    // check if the profile picture is a placeholder
	const isProfilePicturePlaceholder = base64String.startsWith("https://");

    // get first name and last name from full name
    const fullname = formData.get("fullname");
    const names = fullname.split(" ");
    const firstName = names[0];
    const lastName = names[1];

    // create file from base64 string
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
        
        // update user profile image
        try {
            // update user profile image
			const response = await clerkClient().users.updateUserProfileImage(
                userId,
				params
			);
            
        } catch (e) {
            console.log("error", e);
            return { error: e, message: "Error Updating User Profile Image" };
        }
    }

    try {
		// update user data
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
		console.log("error", e);
		return { error: e, message: "Error Updating User Metadata" };
	}
};

// delete user
export const deleteUser = async (userId: string) => {
	try {
		await clerkClient().users.deleteUser(userId);
		return { message: "User Deleted" };
	} catch (e) {
		console.log("error", e);
		return { error: e, message: "Error Deleting User" };
	}
};
