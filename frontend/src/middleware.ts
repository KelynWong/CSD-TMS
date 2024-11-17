import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This Middleware does not protect any routes by default.
// For more information about configuring your Middleware, refer to https://clerk.com/docs/references/nextjs/clerk-middleware
const isPublicRoute = createRouteMatcher([
	"/",
	"/onboarding",
	"/players",
	"/players/:id",
	"/tournaments/:id",
	"/tournaments",
	"/rankings",
	"/prediction",
]);

export default clerkMiddleware((auth, req) => {
	const { userId, sessionClaims } = auth();
	if (!isPublicRoute(req) && !userId) {
		// Redirect to the root URL if the user is not authenticated and the route is not public
		const forbiddenUrl = new URL("/", req.url);
		return NextResponse.redirect(forbiddenUrl);
	}

	if (
			userId &&
			!sessionClaims?.metadata?.onboardingComplete &&
			req.nextUrl.pathname !== "/onboarding"
	) {
		// Redirect to the onboarding page if the user is authenticated but has not completed onboarding
		const onboardingUrl = new URL("/onboarding", req.url);
		return NextResponse.redirect(onboardingUrl);
	}

	const userRole = sessionClaims?.metadata?.role;
	if (req.nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
		// Redirect to a forbidden page or return an error response if the user is not an ADMIN
		const forbiddenUrl = new URL("/", req.url);
		return NextResponse.redirect(forbiddenUrl);
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js1(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
