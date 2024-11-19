// Import necessary modules and components
import { ClerkProvider } from "@clerk/nextjs"; // Authentication provider from Clerk
import "./globals.css"; // Global CSS for the application
import Footer from "@/components/Footer"; // Footer component
import Navbar from "@/components/NavBar"; // Navbar component
import localFont from "next/font/local"; // Local font utility from Next.js
import { ThemeProvider } from "@/components/ThemeProvider"; // Theme provider for dark/light mode
import { UserProvider } from "@/context/userContext"; // Context provider for user-related data
import { FetchUsersProvider } from "@/context/fetchUsersContext"; // Context provider for fetching user data
import { NavBarProvider } from "@/context/navBarContext"; // Context provider for navbar state

// Import a custom local font and define a CSS variable for it
const norwester = localFont({
	src: "./fonts/norwester.otf", // Path to the custom font file
	variable: "--font-norwester", // CSS variable name to apply the font
});

/**
 * RootLayout Component
 * 
 * Provides the overall structure and layout for the application.
 * - Wraps the application with various providers for state and functionality.
 * - Includes a Navbar, Footer, and a ThemeProvider for theming.
 * 
 * Props:
 * - children: ReactNode - The content to render inside the layout.
 */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode; // Content to be rendered within the layout
}) {
	return (
		// ClerkProvider handles authentication using Clerk
		<ClerkProvider>
			{/* UserProvider manages user-related state */}
			<UserProvider>
				{/* FetchUsersProvider manages data fetching for users */}
				<FetchUsersProvider>
					{/* NavBarProvider manages state related to the navigation bar */}
					<NavBarProvider>
						{/* Root HTML structure */}
						<html lang="en" className={norwester.variable}>
							{/* Body of the application */}
							<body suppressHydrationWarning={true}>
								{/* ThemeProvider handles theme (light/dark) settings */}
								<ThemeProvider
									attribute="class" // Attribute to set theme class
									defaultTheme="light" // Default theme is light
									enableSystem // Enables system-based theme
									disableTransitionOnChange // Disables transitions when changing themes
								>
									{/* Header with the Navbar */}
									<header>
										<Navbar />
									</header>

									{/* Main content area */}
									<main>{children}</main>

									{/* Footer component */}
									<footer>
										<Footer />
									</footer>
								</ThemeProvider>
							</body>
						</html>
					</NavBarProvider>
				</FetchUsersProvider>
			</UserProvider>
		</ClerkProvider>
	);
}
