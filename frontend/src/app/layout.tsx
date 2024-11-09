import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserProvider } from "@/context/userContext";
import { FetchUsersProvider } from "@/context/fetchUsersContext";
import { NavBarProvider } from "@/context/navBarContext";

const norwester = localFont({
	src: "./fonts/norwester.otf",
	variable: "--font-norwester",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<UserProvider>
				<FetchUsersProvider>
					<NavBarProvider>
						<html lang="en" className={norwester.variable}>
							<body suppressHydrationWarning={true}>
								<ThemeProvider
									attribute="class"
									defaultTheme="light"
									enableSystem
									disableTransitionOnChange>
									<header>
										<Navbar />
									</header>
									<main>{children}</main>
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
