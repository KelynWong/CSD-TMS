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
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useNavBarContext } from "@/context/navBarContext";
import { Tournament } from "@/types/tournament";
import { fetchAllPlayersByTournament, fetchTournaments } from "@/api/tournaments/api";
import TournamentResultTable from "../tournaments/_components/TournamentResultTable";
import { predictTournament, predictTournament1000 } from "@/api/matchmaking/api";
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
    const [predictionResults, setPredictionResults] = useState<any[]>([]);

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
        getMatchResults();
    }, [selectedTournamentId]);

    const handleTournamentChange = (value: string) => {
        setSelectedTournamentId(value);
        setLoading(true); // Set loading to true when a new tournament is selected
    };

    const handlePredict1000Times = async () => {
        if (selectedTournamentId) {
            try {
                const results = await predictTournament1000(Number(selectedTournamentId));
                const parsedResults = Object.entries(results).map(([key, value]) => {
                    const playerInfo = key.match(/Player\(id=(.*?), username=(.*?), fullname=(.*?),/);
                    return {
                        playerName: playerInfo ? playerInfo[3] : "Unknown",
                        winningRate: value,
                    };
                });
                setPredictionResults(parsedResults);
            } catch (err) {
                console.error("Failed to predict tournament 1000 times:", err);
                setError("An error occurred, please try again later.");
            }
        }
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
            <div className="flex flex-row items-center gap-6">
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
                
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="hover:bg-red-700 hover:text-white" onClick={handlePredict1000Times}>Predict 1000 Times</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Prediction Results</DialogTitle>
                        </DialogHeader>
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
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>{result.playerName}</TableCell>
                                        <TableCell>{result.winningRate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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