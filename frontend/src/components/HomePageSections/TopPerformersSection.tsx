import Link from "next/link";
import Image from "next/image";
import { Fireworks } from "@fireworks-js/react";
import { Player } from "@/types/player";

interface TopPerformersSectionProps {
	playersRank: Player[];
	showFireworks: boolean;
	customOrder: number[];
}

export const TopPerformersSection = ({ playersRank, showFireworks, customOrder }: TopPerformersSectionProps) => {
	if (!playersRank.length) return null;

	return (
		<div className="relative text-center py-12">
			{/* Fireworks */}
			{showFireworks && (
                <>
                    <div className="absolute top-0 left-0 w-full h-full z-0">
                        <Fireworks
                            options={{
                                hue: { min: 0, max: 345 },
                                delay: { min: 15, max: 30 },
                                particles: 50,
                                intensity: 5,
                                explosion: 10,
                            }}
                            className='w-full h-full' />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full z-0">
                        <Fireworks
                            options={{
                                hue: { min: 0, max: 345 },
                                delay: { min: 15, max: 30 },
                                particles: 50,
                                intensity: 5,
                                explosion: 10,
                            }}
                            className='w-full h-full' />
                    </div>
                </>
			)}

			{/* Title */}
			<div className="relative z-10">
				<h2 className="text-3xl font-bold uppercase">🌟 Top Performers 🌟</h2>

				{/* Players */}
				<div className="flex items-end justify-center mt-12 gap-6">
					{customOrder.map((orderIndex) => {
						const player = playersRank[orderIndex];
						return (
							<div key={player.id} className="flex flex-col items-center">
								<Link href={`/players/${player.id}`} className="flex flex-col items-center">
									<Image
										src={player.profilePicture || "/images/default_profile.png"}
										alt={`Player ${player.id}`}
										width={200}
										height={200}
										className="w-16 h-16 object-cover rounded-full"
									/>
									<div className="w-36 text-ellipsis overflow-hidden text-lg mt-2">
										{player.fullname}
									</div>
								</Link>
								<div
									className={`w-36 flex flex-col items-center justify-center mt-3 mx-2.5 p-2.5 rounded-md text-white ${
										orderIndex === 0 ? "h-48 bg-yellow-500" : orderIndex === 1 ? "h-40 bg-gray-400" : "h-32 bg-orange-600"
									}`}
								>
									<div className="font-bold text-3xl">{player.rank}</div>
									<div className="text-lg">{player.rating}</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
