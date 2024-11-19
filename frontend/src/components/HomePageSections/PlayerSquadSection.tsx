import Link from "next/link";
import Image from "next/image";
import { Player } from "@/types/player";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export const PlayerSquadSection = ({ players } : { players: Player[] }) => {
	return (
		<div className="w-full formatPlayer py-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-2xl rounded-t-lg font-bold uppercase">Players Squad</h2>
				<Link href="/players">
					<Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
                        <ArrowUpRight size={18} />
					</Button>
				</Link>
			</div>

			{/* Players Grid */}
			{players.length === 0 ? (
				<div className="text-center text-md italic">No players found.</div>
			) : (
				<div className="w-full grid grid-cols-4 gap-6">
					{players.map((player) => (
						<div key={player.id} className="duration-300 hover:scale-105">
							<Link href={`/players/${player.id}`}>
								<Image
									src={
										player.gender === "Female"
											? player.profilePicture || "/images/female.jpeg"
											: player.profilePicture || "/images/male.jpeg"
									}
									alt={`Player ${player.id}`}
									width={200}
									height={200}
									className="object-cover object-top rounded-lg w-full h-44 duration-300 hover:opacity-70"
								/>
								<div className="flex flex-row justify-between items-start mt-3">
									<div className="flex flex-col">
										<p className="text-lg font-bold leading-none">{player.fullname}</p>
										<p className="text-md font-bold text-red-500 leading-2">{player.rating}</p>
									</div>
									<div className="rounded-full size-8 bg-red-500">
										<p className="text-lg text-white text-center h-full m-0 p-0 leading-8">
											{player.rank}
										</p>
									</div>
								</div>
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
