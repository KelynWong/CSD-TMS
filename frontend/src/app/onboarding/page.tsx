"use client"; // Importing client-side code

import * as React from "react"; // Importing React
import { useUser } from "@clerk/nextjs"; // Importing useUser hook from Clerk
import { useRouter } from "next/navigation"; // Importing useRouter hook from Next.js
import { completeOnboarding } from "./_actions"; // Importing completeOnboarding action
import { Button } from "@/components/ui/button"; // Importing Button component from ui/button
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from "@/components/ui/card"; // Importing Card components from ui/card
import { Label } from "@/components/ui/label"; // Importing Label component from ui/label
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"; // Importing Select components from ui/select
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Importing Avatar components from ui/avatar
import { CountryCombobox } from "./_components/CountryCombobox"; // Importing CountryCombobox component
import { useToast } from "@/hooks/use-toast"; // Importing useToast hook

// Define the OnboardingComponent
export default function OnboardingComponent() {
	const { toast } = useToast(); // Use the useToast hook
	const { user } = useUser(); // Use the useUser hook
	const router = useRouter(); // Use the useRouter hook

	// Initialize state for countryValue, genderValue, and errors
	const [countryValue, setCountryValue] = React.useState("");
	const [genderValue, setGenderValue] = React.useState("");
	const [errors, setErrors] = React.useState({ gender: "", country: "" });

	// Function to handle country change
	const handleCountryChange = (value: string) => {
		setCountryValue(value);
		setErrors((prevErrors) => ({ ...prevErrors, country: "" }));
	};

	// Function to handle gender change
	const handleGenderChange = (value: string) => {
		setGenderValue(value);
		setErrors((prevErrors) => ({ ...prevErrors, gender: "" }));
	};

	// Function to validate the form
	const validateForm = () => {
		let isValid = true;
		const newErrors = { gender: "", country: "" };

		if (!genderValue) {
			newErrors.gender = "Please select a gender";
			isValid = false;
		}

		if (!countryValue) {
			newErrors.country = "Please select a country";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	// Function to handle form submission
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (validateForm()) {
			const formData = new FormData();
			formData.append("gender", genderValue);
			formData.append("country", countryValue);

			try {
				await completeOnboarding(formData);
				await user?.reload();
				router.push("/");
			} catch (error) {
				toast({
					title: "Error",
					description:
						"There was a problem submitting your information. Please try again.",
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Validation Error",
				description: "Please fill in all required fields.",
				variant: "destructive",
			});
		}
	};

	// Render the OnboardingComponent
	return (
		<div className="px-8 py-12 sm:py-16 md:px-20">
			<Card className="mx-auto max-w-sm">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4">
						<Avatar className="h-24 w-24">
							<AvatarImage
								src={user?.imageUrl}
								alt={user?.fullName || "User"}
							/>
							<AvatarFallback>
								{user?.firstName?.charAt(0) || "U"}
							</AvatarFallback>
						</Avatar>
					</div>
					<CardTitle>Welcome to TMS, {user?.firstName}!</CardTitle>
					<CardDescription>Please complete your profile</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-1">
							<Label htmlFor="gender">Gender</Label>
							<p className="text-xs text-muted-foreground">
								Please select your gender
							</p>
							<Select name="gender" onValueChange={handleGenderChange}>
								<SelectTrigger id="gender">
									<SelectValue placeholder="Select your gender" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Male">Male</SelectItem>
									<SelectItem value="Female">Female</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
							{errors.gender && (
								<p className="text-red-500 text-xs">{errors.gender}</p>
							)}
						</div>
						<div className="space-y-1">
							<Label htmlFor="country">Country</Label>
							<p className="text-xs text-muted-foreground">
								Select the country you are from
							</p>
							<CountryCombobox
								value={countryValue}
								onChange={handleCountryChange}
							/>
							{errors.country && (
								<p className="text-red-500 text-xs">{errors.country}</p>
							)}
						</div>
					</CardContent>
					<CardFooter>
						<Button className="w-full" type="submit">
							Complete Profile
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
