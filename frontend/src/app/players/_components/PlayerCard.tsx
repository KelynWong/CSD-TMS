import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PlayerCardProps } from "@/types/player";
import Link from "next/link";

export const PlayerCard = ({ player }: { player: PlayerCardProps }) => {
	console.log("PlayerCard", player);
	return (
		<Link href={`/players/${player.id}`}>
			<Card className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] mx-auto p-4">
				<CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6">
					<div className="w-full h-full flex flex-col items-center justify-center">
						<Image
							src={
								player.profilePicture ||
								"/images/default_profile.png"
							}
							alt={`Player ${player.id}`}
							width={200}
							height={200}
							className="w-full h-full object-cover rounded-full"
						/>
						<p className="text-2xl font-semibold text-center ">
							{player.fullname}
						</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
