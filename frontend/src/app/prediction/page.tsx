// update the simulate-many
// do it such that by default it will j show the first select

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
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useNavBarContext } from "@/context/navBarContext";
import { Tournament } from "@/types/tournament";
import { fetchAllPlayersByTournament, fetchTournamentsByStatus } from "@/api/tournaments/api";
import TournamentResultTable from "../tournaments/_components/TournamentResultTable";
import { predictTournament, predictTournament1000 } from "@/api/matchmaking/api";
import { fetchPlayer } from "@/api/users/api";
import { Player } from "@/types/tournamentDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchMatchByTournamentId } from "@/api/matches/api";

export default function Prediction() {
    const [loading, setLoading] = useState(true);
    const { setState } = useNavBarContext();
    setState("matchPredict");
    
    const [categorizedTournaments, setCategorizedTournaments] = useState<Tournament[]>([]);
    const [selectedTournamentId, setSelectedTournamentId] = useState<string | undefined>(undefined);
    const [matchResults, setMatchResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [predictionResults, setPredictionResults] = useState<any[]>([]);

    useEffect(() => {
        const getTournamentsData = async () => {
            try {
                const data = await fetchTournamentsByStatus("Ongoing");
                setCategorizedTournaments(data);
                if (data.length > 0) {
                    setSelectedTournamentId(data[0].id.toString());
                    fetchTournament(data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch tournaments:", err);
                setError("Failed to fetch tournaments.");
            } finally {
                setLoading(false);
            }
        };
        getTournamentsData();
    }, []);

    const fetchTournament = async (tournament_id: Number) => {
        setLoading(true);
        try {
            const playersData = await fetchAllPlayersByTournament(Number(tournament_id));
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

            const matchesData = await fetchMatchByTournamentId(Number(tournament_id));
            const enrichedMatches = await Promise.all(
                matchesData.map(async (match) => {
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
                })
            );

            setMatchResults(enrichedMatches);
        } catch (err) {
            console.error("Failed to fetch tournament:", err);
            setError("Failed to fetch tournament.");
        } finally {
            setLoading(false);
        }
    };

    const handlePredict = async () => {
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
                    const formattedScores = match.games.map((game: { player1Score: any; player2Score: any; }) => `${game.player1Score}-${game.player2Score}`).join(' / ');
                    return {
                        id: match.id,
                        tournamentId: match.tournamentId,
                        player1,
                        player2,
                        winner,
                        formattedScores,
                        left: match.left,
                        right: match.right,
                        games: match.games,
                        roundNum: match.roundNum,
                    };
                });
    
                setMatchResults(enrichedMatches);
            } catch (err) {
                console.error("Failed to fetch match results:", err);
                setError("An error occurred, please try again later.");
                setMatchResults([]);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleTournamentChange = (value: string) => {
        setSelectedTournamentId(value);
        fetchTournament(Number(value));
    };

    const handlePredict1000Times = async () => {
        if (selectedTournamentId) {
            try {
                setLoading(true);
                const results = await predictTournament1000(Number(selectedTournamentId));
                // Sort the parsed results based on rank
                results.sort((a, b) => a.rank - b.rank);
                setPredictionResults(results);
            } catch (err) {
                console.error("Failed to predict tournament 1000 times:", err);
                setError("An error occurred, please try again later.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (error) {
        return (
            <div className="w-[80%] h-full mx-auto py-16">
				<div className="flex flex-col items-center justify-center h-full">
					<img src="/images/error.png" className="size-72" alt="No Ongoing Tournament" />
					<h1 className="text-2xl font-bold text-center mt-8 text-red-500">{error}</h1>
				</div>
			</div>
        );
    }

    return (
        <div className="w-[80%] h-full mx-auto py-16">
            <h1 className="text-3xl font-bold text-start">Predict results for ongoing tournament</h1>
            <div className="flex flex-row items-center gap-2">
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

                <Button variant="outline" className="hover:bg-red-700 hover:text-white" onClick={handlePredict}>Predict</Button>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="hover:bg-red-700 hover:text-white" onClick={handlePredict1000Times}>Predict 1000 Times</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Prediction Results</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-80 w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Rank</TableHead>
                                        <TableHead>Player</TableHead>
                                        <TableHead>Winning Rate</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {predictionResults.map((result, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{result.rank}</TableCell>
                                            <TableCell>{result.playerName}</TableCell>
                                            <TableCell>{result.winRate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            { loading ? (
                <Loading />
            ) : (
                categorizedTournaments.length > 0 ? (
                    <div className="results">
                        <TournamentResultTable matchResult={matchResults} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <img src="/images/no_ongoing.png" className="size-72" alt="No Ongoing Tournament" />
                        <h1 className="text-2xl font-bold text-center mt-8">No Ongoing Tournaments...</h1>
                    </div>
                )
            )}
        </div>
    );
}