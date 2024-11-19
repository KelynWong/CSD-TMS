import { Card, CardContent } from "@/components/ui/card"; // Import Card and CardContent components from ui/card
import Image from "next/image"; // Import Image component from next/image
import { PlayerCardProps } from "@/types/player"; // Import PlayerCardProps from types/player
import Link from "next/link"; // Import Link component from next/link

// Define the PlayerCard component
export const PlayerCard = ({ player }: { player: PlayerCardProps }) => {
	return (
		// Wrap the card in a Link component for navigation
		<Link href={`/players/${player.id}`} prefetch={true}>
			<Card 
				className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] mx-auto p-4" 
				// Style the card with different max-widths for different screen sizes
			>
				<CardContent 
					className="flex aspect-square items-center justify-center p-4 sm:p-6" 
					// Style the card content with a square aspect ratio and different padding for different screen sizes
				>
					<div className="w-full h-full flex flex-col items-center justify-center">
						<Image
							src={player.profilePicture || "/images/default_profile.png"} // Use the player's profile picture or a default if not available
							alt={`Player ${player.id}`} // Set the alt text for accessibility
							width={200} // Set the width of the image
							height={200} // Set the height of the image
							className="w-full h-full object-cover rounded-full" // Style the image to cover the container and be rounded
						/>
						<p className="text-2xl font-semibold text-center ">
							{player.fullname} {/* Display the player's full name */}
						</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
