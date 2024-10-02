"use server";

import { clerkClient } from "@clerk/nextjs/server";

export const updateUser = async (userId: string, formData: FormData) => {
	if (!userId) {
		return { message: "No Logged In User" };
	}

	const response = await clerkClient().users.getUser(userId);

	try {
		await clerkClient().users.updateUser(userId, {
			publicMetadata: {
				onboardingComplete: true,
				role: formData.get("role"),
				gender: response.publicMetadata.gender,
				country: response.publicMetadata.country,
			},
		});

		// update user rating

		return { message: "User metadata Updated" };
	} catch (e) {
		console.log("error", e);
		return { error: e, message: "Error Updating User Metadata" };
	}
};

export const deleteUser = async (userId: string) => {
	try {
		await clerkClient().users.deleteUser(userId);
		return { message: "User Deleted" };
	} catch (e) {
		console.log("error", e);
		return { error: e, message: "Error Deleting User" };
	}
};
