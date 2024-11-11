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
import { getAllPlayerDetails } from "@/api/users/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchMatchByTournamentId } from "@/api/matches/api";

export type PlayerResponse = {
	id: string;
	username: string;
	fullname: string;
	gender: string;
	rating: number;
	country: string;
	profilePicture: string;
	email: string;
	role: string;
	rank: number;
};

export default function Prediction() {
    const [loading, setLoading] = useState(true);
    const { setState } = useNavBarContext();
    setState("matchPredict");
    
    const [categorizedTournaments, setCategorizedTournaments] = useState<Tournament[]>([]);
    const [selectedTournamentId, setSelectedTournamentId] = useState<string | undefined>(undefined);
    const [matchResults, setMatchResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [predictionResults, setPredictionResults] = useState<any[]>([]);

    const getTournamentsData = async () => {
        try {
            const [matchmakeData, ongoingData] = await Promise.all([
                fetchTournamentsByStatus("Matchmake"),
                fetchTournamentsByStatus("Ongoing")
            ]);
    
            const combinedData = [...matchmakeData, ...ongoingData];
            setCategorizedTournaments(combinedData);
    
            if (combinedData.length > 0) {
                setSelectedTournamentId(combinedData[0].id.toString());
                fetchTournament(combinedData[0].id);
            }
        } catch (err) {
            console.error("Failed to fetch tournaments:", err);
            setError("Failed to fetch tournaments.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getTournamentsData();
    }, []);

    const fetchTournament = async (tournament_id: Number) => {
        setLoading(true);
        try {
            const playersData = await fetchAllPlayersByTournament(Number(tournament_id));
            const fullPlayersData = await getAllPlayerDetails(playersData);
            const matchesData = await fetchMatchByTournamentId(Number(tournament_id));
            const enrichedMatches = await Promise.all(
                matchesData.map(async (match) => {
                    const player1 = Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.player1Id) || null : null;
                    const player2 = Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.player2Id) || null : null;
                    const winner = Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.winnerId) || null : null;
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
            console.log("enrichedMatches", enrichedMatches);
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
                const fullPlayersData = await getAllPlayerDetails(playersData);
                const enrichedMatches = results.map((match) => {
                    const player1 = Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.player1Id) || null : null;
                    const player2 = Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.player2Id) || null : null;
                    const winner = Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.winnerId) || null : null;
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
            <h1 className="text-3xl font-bold text-start">Predict results for tournaments</h1>
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
                        <Button variant="outline" className="hover:bg-red-700 hover:text-white" onClick={handlePredict1000Times}>Predict 10000 Times</Button>
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
                                            <TableCell>{result.winRate.toFixed(1)}%</TableCell>
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