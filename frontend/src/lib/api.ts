export async function updateUser() {
	const response = await fetch("/api/users/updateUser", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("Failed to update user");
	}

	return response.json();
}
