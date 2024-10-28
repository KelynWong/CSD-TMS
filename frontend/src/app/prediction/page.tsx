"use client";

import "../tournaments/styles.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useNavBarContext } from "@/context/navBarContext";
import { Tournament } from "@/types/tournament";
import { fetchAllPlayersByTournament, fetchTournaments } from "@/api/tournaments/api";
import TournamentResultTable from "../tournaments/_components/TournamentResultTable";
import { predictTournament } from "@/api/matchmaking/api";
import { fetchPlayer } from "@/api/users/api";
import { Player } from "@/types/tournamentDetails";

export default function Prediction() {
    const [loading, setLoading] = useState(true);
    const { setState } = useNavBarContext();
    setState("matchPredict");
    const [categorizedTournaments, setCategorizedTournaments] = useState<Tournament[]>([]);
    const [selectedTournamentId, setSelectedTournamentId] = useState<string | undefined>(undefined);
    const [matchResults, setMatchResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTournamentsData = async () => {
            try {
                const data = await fetchTournaments();
                const ongoingTournaments = data.filter(tournament => tournament.status === "Ongoing");
                setCategorizedTournaments(ongoingTournaments);
                if (ongoingTournaments.length > 0) {
                    setSelectedTournamentId(ongoingTournaments[0].id.toString());
                    setLoading(true);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to fetch tournaments:", err);
                setError("Failed to fetch tournaments.");
                setLoading(false);
            }
        };
        getTournamentsData();
    }, []);

    useEffect(() => {
        const getMatchResults = async () => {
            if (selectedTournamentId) {
                setLoading(true);
                try {
                    const results = await predictTournament(Number(selectedTournamentId));

                    const playersData = await fetchAllPlayersByTournament(Number(selectedTournamentId));
                    const fullPlayersData = await Promise.all(
                        playersData.map(async (player) => {
                            const playerData = await fetchPlayer(player.id);
                            return {
                                id: player.id,
                                username: playerData.username,
                                fullname: playerData.fullname,
                                gender: playerData.gender,
                                rating: playerData.rating,
                                country: playerData.country,
                                profilePicture: playerData.profilePicture,
                                email: playerData.email,
                                role: playerData.role,
                            };
                        })
                    );

                    const enrichedMatches = results.map((match) => {
                        const player1 = fullPlayersData.find(player => player.id === match.player1Id) as Player || null;
                        const player2 = fullPlayersData.find(player => player.id === match.player2Id) as Player || null;
                        const winner = fullPlayersData.find(player => player.id === match.winnerId) as Player || null;
                        return {
                            id: match.id,
                            tournamentId: match.tournamentId,
                            player1,
                            player2,
                            winner,
                            left: match.left,
                            right: match.right,
                            games: match.games,
                            roundNum: match.roundNum,
                        };
                    });

                    setMatchResults(enrichedMatches);
                } catch (err) {
                    console.error("Failed to fetch match results:", err);
                    setError("Failed to fetch match results.");
                    setMatchResults([]);
                } finally {
                    setLoading(false);
                }
            }
        };
        getMatchResults();
    }, [selectedTournamentId]);

    const handleTournamentChange = (value: string) => {
        setSelectedTournamentId(value);
        setLoading(true); // Set loading to true when a new tournament is selected
    };

    if (loading) {
        return (
            <div className="w-[80%] mx-auto py-16">
                <h1 className="text-3xl font-bold text-start">Predict results for upcoming tournament</h1>
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-[80%] mx-auto py-16">
                <h1 className="text-3xl font-bold text-start">Predict results for upcoming tournament</h1>
                <div className="text-center text-md italic mt-16 text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="w-[80%] mx-auto py-16">
            <h1 className="text-3xl font-bold text-start">Predict results for upcoming tournament</h1>
            <Select value={selectedTournamentId} onValueChange={handleTournamentChange}>
                <SelectTrigger className="w-[320px] my-6 text-md">
                    <SelectValue placeholder="Pick a Tournament" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {categorizedTournaments
                            .sort((a, b) => a.tournamentName.localeCompare(b.tournamentName))
                            .map((tournament) => (
                                <SelectItem key={tournament.id} value={tournament.id.toString()}>
                                    {tournament.tournamentName}
                                </SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

            {selectedTournamentId && matchResults.length > 0 ? (
                <TournamentResultTable matchResult={matchResults} />
            ) : (
                <div className="text-center text-md italic mt-16">
                    {selectedTournamentId ? "No match results found for this tournament." : "Select a tournament to simulate prediction of match results."}
                </div>
            )}
        </div>
    );
}