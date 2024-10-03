import React from "react";
import Image from "next/image";
import { Player } from "../types/player";

const PlayerHero = ({ player }: { player: Player }) => {
	console.log(player);
	const length = player?.fullname ? player.fullname.split(" ").length : 0;
	const firstName = player?.fullname
		? player.fullname
				.split(" ")
				.slice(0, length - 1)
				.join(" ")
		: "";
	const lastName = player?.fullname
		? player.fullname.split(" ").slice(-1).join(" ")
		: "";
	const winRate = player
		? Math.ceil((player.wins / player.total_matches) * 100)
		: 0;

	return (
		<div className="bg-black text-white">
			{/* Player Profile Hero Section */}
			<section className="relative min-h-[200px]">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<Image
						src="/images/background.png"
						alt="Table Tennis Action"
						fill
						className="object-cover opacity-50 object-top"
						style={{
							objectPosition: "0 20%",
						}}
						priority
					/>
				</div>

				{/* Profile Content */}
				<div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
					<div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
						<Image
							src={player.profilePicture || "/images/default_profile.png"}
							alt={`Player ${player.fullname}`}
							width={150}
							height={150}
							className="rounded-full border-4 border-red-500"
						/>
						<div className="text-center md:text-left">
							<h1 className="text-8xl font-bold">{firstName}</h1>
							<p className="text-4xl">{lastName}</p>
							<p className="text-red-600 text-2xl">{player.country}</p>
						</div>
					</div>
				</div>

				{/* Player Stats */}
				<div className="relative z-10 max-w-6xl mx-auto py-8">
					<div className="max-w-8xl mx-auto px-4 grid grid-cols-2 md:grid-cols-6 gap-4">
						<div className="text-center">
							<p className="text-sm uppercase">Current Ranking</p>
							<p className="text-2xl font-bold">3</p>
						</div>
						<div className="text-center">
							<p className="text-sm uppercase">Current Rating</p>
							<p className="text-2xl font-bold">{player.rating}</p>
						</div>
						<div className="text-center">
							<p className="text-sm uppercase">Current Wins</p>
							<p className="text-2xl font-bold">{player.wins}</p>
						</div>
						<div className="text-center">
							<p className="text-sm uppercase">Current Losses</p>
							<p className="text-2xl font-bold">{player.losses}</p>
						</div>
						<div className="text-center">
							<p className="text-sm uppercase">Total Matches</p>
							<p className="text-2xl font-bold">{player.total_matches}</p>
						</div>
						<div className="text-center">
							<p className="text-sm uppercase">Win Rate</p>
							<p className="text-2xl font-bold">{winRate}%</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default PlayerHero;
