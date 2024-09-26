import { auth } from "@clerk/nextjs/server";

export default function Home() {
	// const { user } = useUser();
	const { userId, sessionClaims, redirectToSignIn } = auth();

	return (
		<div>
			<h1>Welcome to your Clerk app, {userId}!</h1>
			<p>This is a simple example of how to use Clerk in your Next.js app.</p>
		</div>
	);
}
