import { Button } from "@/components/ui/button"; // Import Button component from ui/button
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"; // Import Dialog components from ui/dialog
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"; // Import Select components from ui/select
import { Input } from "@/components/ui/input"; // Import Input component from ui/input
import { Label } from "@/components/ui/label"; // Import Label component from ui/label
import * as React from "react"; // Import React
import { updateUser } from "../_actions"; // Import updateUser action from actions
import { message } from "antd"; // Import message utility from antd for displaying success or error messages
import { useFetchUsersContext } from "@/context/fetchUsersContext"; // Import context for fetching users
import { CountryCombobox } from "./CountryCombobox"; // Import CountryCombobox component

import { Upload } from "lucide-react"; // Import Upload icon from lucide-react

// Define the UpdateUserModal component
export function UpdateUserModal({
	isOpen,
	onClose,
	userData,
}: {
	isOpen: boolean; // Boolean indicating if the modal is open
	onClose: () => void; // Function to close the modal
	userData: TData; // Data of the user to be updated
}) {
	// Function to handle image upload
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfile(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const { setShouldFetchUsers } = useFetchUsersContext(); // Use context to set flag for fetching users

	// State to store the role of the user
	const [role, setRole] = React.useState(userData.role);
	const handleRoleChange = (value: string) => {
		setRole(value);
	};

	// State to store the country of the user
	const [country, setCountry] = React.useState(userData.country);
	const handleCountryChange = (value: string) => {
		setCountry(value);
	};

	// State to store the fullname of the user
	const [fullname, setFullname] = React.useState(userData.fullname);
	const handleFullnameChange = (value: string) => {
		setFullname(value.target.value);
	};

	// State to store the username of the user
	const [username, setUsername] = React.useState(userData.username);
	const handleUsernameChange = (value: string) => {
		setUsername(value.target.value);
	};

	// State to store the profile picture of the user
	const [profile, setProfile] = React.useState(userData.profilePicture);

	// State to store the gender of the user
	const [gender, setGender] = React.useState(userData.gender);
	const handleGenderChange = (value: string) => {
		setGender(value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("role", role);
		formData.append("country", country);
		formData.append("fullname", fullname);
		formData.append("username", username);
		formData.append("profilePicture", profile);
		formData.append("gender", gender);

		try {
			const response = await updateUser(userData.id, formData);
			setTimeout(() => {
				setShouldFetchUsers(true);
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
						Make changes to the profile here. Click save when you're
						done.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="flex items-center justify-center mb-6">
						<div className="relative">
							{profile ? (
								<img
									src={profile}
									alt="Profile"
									className="w-24 h-24 rounded-full object-cover"
								/>
							) : (
								<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
									R
								</div>
							)}
							<label
								htmlFor="profile-upload"
								className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer">
								<Upload className="h-4 w-4" />
							</label>
							<input
								id="profile-upload"
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
							/>
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="username" className="text-right">
							Username
						</Label>
						<Input
							type="text"
							id="username"
							defaultValue={userData.username}
							className="col-span-3"
							onChange={handleUsernameChange}
						/>
						<Label htmlFor="fullname" className="text-right">
							Full Name
						</Label>
						<Input
							type="text"
							id="fullname"
							defaultValue={userData.fullname}
							className="col-span-3"
							onChange={handleFullnameChange}
						/>
						<Label htmlFor="gender" className="text-right">
							Gender
						</Label>
						<Select
							defaultValue={gender}
							onValueChange={handleGenderChange}>
							<SelectTrigger className="col-span-3" id="role">
								<SelectValue placeholder="Select a gender" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Female">Female</SelectItem>
								<SelectItem value="Male">Male</SelectItem>
							</SelectContent>
						</Select>
						<Label htmlFor="country" className="text-right">
							Country
						</Label>
						<CountryCombobox
							value={country}
							onChange={handleCountryChange}
						/>
						<Label htmlFor="role" className="text-right">
							Role
						</Label>
						<Select
							defaultValue={role}
							onValueChange={handleRoleChange}>
							<SelectTrigger className="col-span-3" id="role">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PLAYER">PLAYER</SelectItem>
								<SelectItem value="ADMIN">ADMIN</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<DialogFooter className="mt-5">
						<Button type="submit">Save</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
