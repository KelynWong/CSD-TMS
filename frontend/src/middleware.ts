import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This Middleware does not protect any routes by default.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your Middleware
const isPublicRoute = createRouteMatcher(["/", "/onboarding"]);

export default clerkMiddleware((auth, req) => {
	const { userId, sessionClaims, redirectToSignIn } = auth();
	if (!isPublicRoute(req) && !userId)
		return redirectToSignIn({ returnBackUrl: req.url });

	if (
		userId &&
		!sessionClaims?.metadata?.onboardingComplete &&
		req.nextUrl.pathname !== "/onboarding"
	) {
		const onboardingUrl = new URL("/onboarding", req.url);
		return NextResponse.redirect(onboardingUrl);
	}
  
	const userRole = sessionClaims?.metadata?.role;
	if (req.nextUrl.pathname.startsWith("/admin") && userRole !== "Admin") {
		// Redirect to a forbidden page or return an error response
		const forbiddenUrl = new URL("/", req.url);
		return NextResponse.redirect(forbiddenUrl);
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
