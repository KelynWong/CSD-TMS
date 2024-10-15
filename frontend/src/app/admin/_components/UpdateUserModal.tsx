import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { updateUser } from "../_actions";
import { message } from "antd";
import { useFetchUsersContext } from "@/context/fetchUsersContext";

export function UpdateUserModal({
	isOpen,
	onClose,
	userData,
	onSave,
}: {
	isOpen: boolean;
	onClose: () => void;
	userData: TData;
	onSave: (user: TData) => void;
}) {
  const { setShouldFetchUsers } = useFetchUsersContext();
	const [role, setRole] = React.useState(userData.role);
	const handleRoleChange = (value: string) => {
		setRole(value);
	};

	const [rating, setRating] = React.useState(userData.rating);
	const handleRatingChange = (value: string) => {
		setRating(value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("role", role);
		formData.append("rating", rating);
		try {
			const response = await updateUser(userData.id, formData);
			setTimeout(() => {
        setShouldFetchUsers(true);
				onSave({
					...userData,
					role,
					rating,
				});
				message.success("User updated successfully");
				onClose(); // Close the modal
			}, 1500);
		} catch (error) {
			message.error("Failed to update user");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>
						Make changes to the profile here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="role" className="text-right">
							Role
						</Label>
						<Select defaultValue={role} onValueChange={handleRoleChange}>
							<SelectTrigger className="col-span-3" id="role">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Player">Player</SelectItem>
								<SelectItem value="Admin">Admin</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-4 items-center gap-4 mt-4">
						<Label htmlFor="rating" className="text-right">
							Rating
						</Label>
						<Input
							type="number"
							id="rating"
							defaultValue={role === "Admin" ? 0 : rating}
							className="col-span-3"
							disabled={role === "Admin"}
							onChange={(e) => handleRatingChange(e.target.value)}
						/>
					</div>
					<DialogFooter className="mt-5">
						<Button type="submit">Update user</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
