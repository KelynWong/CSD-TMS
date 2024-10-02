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
import { deleteUser } from "../_actions";
import { message } from "antd";

export function DeleteUserModal({
	isOpen,
	onClose,
	userData,
}: {
	isOpen: boolean;
	onClose: () => void;
	userData: TData;
}) {
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await deleteUser(userData.id);
      console.log(response);
			message.success("User deleted successfully");
		} catch (error) {
      message.error("Failed to delete user");
		}
    onClose(); // Close the modal
	};

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
