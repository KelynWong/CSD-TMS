"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CountryCombobox } from "./_components/CountryCombobox";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingComponent() {
	const { toast } = useToast();
	const { user } = useUser();
	const router = useRouter();

	const [countryValue, setCountryValue] = React.useState("");
	const [genderValue, setGenderValue] = React.useState("");
	const [errors, setErrors] = React.useState({ gender: "", country: "" });

	const handleCountryChange = (value: string) => {
		setCountryValue(value);
		setErrors((prevErrors) => ({ ...prevErrors, country: "" }));
	};

	const handleGenderChange = (value: string) => {
		setGenderValue(value);
		setErrors((prevErrors) => ({ ...prevErrors, gender: "" }));
	};

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
									<SelectItem value="male">Male</SelectItem>
									<SelectItem value="female">Female</SelectItem>
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
