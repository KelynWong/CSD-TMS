// Import necessary components and utilities
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import * as React from "react";
import { deleteUser } from "../_actions"; // Import deleteUser action from actions
import { message } from "antd"; // Import message utility from antd for displaying success or error messages
import { useFetchUsersContext } from "@/context/fetchUsersContext"; // Import context for fetching users

// Define the DeleteUserModal component
export function DeleteUserModal({
	isOpen,
	onClose,
	userData,
}: {
	isOpen: boolean; // Boolean indicating if the modal is open
	onClose: () => void; // Function to close the modal
	userData: TData; // Data of the user to be deleted
}) {
	const { setShouldFetchUsers } = useFetchUsersContext(); // Use context to set flag for fetching users

	// Function to handle form submission for deleting a user
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // Prevent the default form submission behavior
		try {
			const response = await deleteUser(userData.id); // Attempt to delete the user
			setTimeout(() => {
				setShouldFetchUsers(true); // Set flag to fetch users after deletion
				message.success("User deleted successfully"); // Display success message
				onClose(); // Close the modal
			}, 1500); // Wait for 1.5 seconds before closing the modal
		} catch (error) {
			message.error("Failed to delete user"); // Display error message if deletion fails
		}
		onClose(); // Close the modal regardless of the outcome
	};

	// Render the DeleteUserModal component
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete User</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this user?
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<DialogFooter className="mt-5">
						<Button type="submit">Delete user</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
