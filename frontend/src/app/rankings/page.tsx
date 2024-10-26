"use client";

import PlayersCarousel from "./_components/PlayersCarousel";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/DataTableColumns";
import { PlayerResponse, fetchTopPlayers } from "../../api/users/api";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

interface PlayerWithRank extends PlayerResponse {
    ranking: number;
}

export default function Players() {
    const [loading, setLoading] = useState(true);
	
	// Set top 10 players state
	const [topPlayers, setTopPlayers] = useState<PlayerWithRank[]>([]);

    // Fetch top 10 players on page load
	useEffect(() => {
		const fetchPlayers = async () => {
			try {
				const players = await fetchTopPlayers();
				const playersWithRank: PlayerWithRank[] = players.map((player, index) => ({
                    ...player,
                    ranking: index + 1,
                    }));
                setTopPlayers(playersWithRank);
                setLoading(false);
			} catch (error) {
				console.error("Failed to fetch top players", error);
			}
		};
		fetchPlayers();
	}, []);
    
    const top10Players = topPlayers.slice(0, 10);
    console.log(topPlayers);

    // Show loading spinner while fetching data
    if (loading) {
        return <Loading />;
    }

	return (
		<div className="w-full max-w-full overflow-hidden px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl relative py-12 px-8 sm:px-12">
				<PlayersCarousel players={top10Players}/>
			</div>
			<div className="container mx-auto py-10">
				<DataTable columns={columns} data={topPlayers} />
			</div>
		</div>
	);
}
