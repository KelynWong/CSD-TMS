import { auth } from "@clerk/nextjs/server"; // Import auth from Clerk for authentication
import { redirect } from "next/navigation"; // Import redirect from next/navigation for redirecting users

// Define the RootLayout component
export default function RootLayout({
	children,
}: {
	children: React.ReactNode; // The children component to be rendered
}) {
	// Check if the user has completed the onboarding process
	// If the user has completed onboarding, redirect them to the dashboard
	if (auth().sessionClaims?.metadata.onboardingComplete === true) {
		redirect("/dashboard"); // Redirect to the dashboard
	}

	// Render the children component
	return <>{children}</>;
}
