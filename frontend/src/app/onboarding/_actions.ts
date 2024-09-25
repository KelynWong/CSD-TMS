"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: FormData) => {
	const { userId } = auth();

	if (!userId) {
		return { message: "No Logged In User" };
	}

	try {
		await clerkClient().users.updateUser(userId, {
			publicMetadata: {
				onboardingComplete: true,
				gender: formData.get("gender"),
				country: formData.get("country"),
			},
		});
		return { message: "User metadata Updated" };
	} catch (e) {
		console.log("error", e);
		return { message: "Error Updating User Metadata" };
	}
};
