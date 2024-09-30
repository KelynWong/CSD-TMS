"use client";

import { PlayerCard } from "./_components/PlayerCard";
import { Player, PlayerCardProps,  } from "@/types/player";
import { fetchUserByRoles } from "@/api/users/api";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function Players() {
	const [PlayerCardProps, setPlayerCardProps] = useState<PlayerCardProps[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetchUserByRoles("Player").then((data: PlayerResponse[]) => {
			setLoading(false);
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

	if (loading) {
		return <Loading />;
	}
  
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
