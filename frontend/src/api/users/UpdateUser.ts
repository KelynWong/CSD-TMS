import { clerkClient, getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Get the user ID from the session
	const { userId } = getAuth(req);

	if (!userId) {
		return res.status(500).json({ error: "No valid user" });
	}

	// The user attributes to update
	const params = { firstName: "John", lastName: "Wick" };

	const updatedUser = await clerkClient.users.updateUser(userId, params);

	return res.status(200).json({ updatedUser });
}
