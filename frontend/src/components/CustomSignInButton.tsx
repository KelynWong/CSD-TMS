import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function CustomSignInButton() {
	const { user } = useUser();
  
	return (
		<SignInButton
			mode="modal"
			signUpForceRedirectUrl="/players/create"
			forceRedirectUrl="/players/create">
			<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
				JOIN NOW
			</button>
		</SignInButton>
	);
}
