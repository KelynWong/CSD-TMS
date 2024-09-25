"use client";

import { PlayerCard } from "./_components/PlayerCard";
import { Player, PlayerCardProps } from "@/types/player";
import { fetchPlayers } from "@/api/users/api";
import { useEffect, useState } from "react";
export default function Players() {
	const [PlayerCardProps, setPlayerCardProps] = useState<PlayerCardProps[]>([]);
	useEffect(() => {
		fetchPlayers().then((data) => {
			console.log(data);
			const mappedData: PlayerCardProps[] = data.map((player: Player) => {
				return {
					id: player.id,
					username: player.username,
					fullname: player.fullname,
					gender: player.gender,
					profilePicture: player.profilePicture,
				};
			});
			setPlayerCardProps(mappedData);
		});
	}, []);
	// console.log(playersCardProps);
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Players</h1>
			<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{PlayerCardProps.map((player) => (
					<PlayerCard key={player.id} player={player} />
				))}
			</div>
		</div>
	);
}
