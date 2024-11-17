"use client";

import PlayersCarousel from "./_components/PlayersCarousel";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/DataTableColumns";
import { PlayerResponse, fetchTopPlayers } from "../../api/users/api";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useNavBarContext } from "@/context/navBarContext";

// Interface to extend PlayerResponse with a ranking property
interface PlayerWithRank extends PlayerResponse {
    ranking: number;
}

// Players component definition
export default function Players() {
    // State to manage loading status
    const [loading, setLoading] = useState(true);
    // State to manage error message
    const [error, setError] = useState<string | null>(null);

    // Set navbar context to 'rankings'
    const { setState } = useNavBarContext();
    setState("rankings");
    
    // State to manage top players with their ranking
    const [topPlayers, setTopPlayers] = useState<PlayerWithRank[]>([]);

    // Fetch top 10 players on page load
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const players = await fetchTopPlayers();
                // Map players to include their ranking
                const playersWithRank: PlayerWithRank[] = players.map((player, index) => ({
                    ...player,
                    ranking: index + 1,
                }));
                setTopPlayers(playersWithRank);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch top players", error);
                setError("No Players Found.");
            } finally {
                setLoading(false);
            }
        };
        fetchPlayers();
    }, []);

    // Slice top players to get the top 10
    const top10Players = topPlayers.slice(0, 10);

    // Show loading spinner while fetching data
    if (loading) {
        return <Loading />;
    }

    // Display error message if error occurs
    if (error) {
        return (
            <div className="w-[80%] h-full mx-auto py-16">
                <div className="flex flex-col items-center justify-center h-full">
                    <img src="/images/error.png" className="size-72" alt="No Players Found" />
                    <h1 className="text-2xl font-bold text-center mt-8 text-red-500">{error}</h1>
                </div>
            </div>
        );
    }

    // Display message if no players are found
    if (topPlayers.length === 0 && top10Players.length === 0) {
        return (
            <div className="w-[80%] h-full mx-auto py-16">
                <div className="flex flex-col items-center justify-center h-full">
                    <img src="/images/no_ongoing.png" className="size-72" alt="No Players Found" />
                    <h1 className="text-2xl font-bold text-center mt-8 text-red-500">No players found.</h1>
                </div>
            </div>
        );
    }

    // Render the players page with carousel and data table
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
