"use client";

import "../tournaments/styles.css";
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useNavBarContext } from "@/context/navBarContext";
import { Tournament } from "@/types/tournament";
import { fetchAllPlayersByTournament, fetchTournamentsByStatus } from "@/api/tournaments/api";
import TournamentResultTable from "../tournaments/_components/TournamentResultTable";
import { predictTournament, predictTournament1000 } from "@/api/matchmaking/api";
import { getAllPlayerDetails } from "@/api/users/api";

import { fetchMatchByTournamentId } from "@/api/matches/api";
import PredictionDialog from "./_components/PredictionDialog";
import TournamentSelect from "./_components/TournamentSelect";
import ErrorDisplay from "../../components/ErrorDisplay";
import NoTournamentDisplay from "../../components/NoTournamentDisplay";

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
    // state for loading indicator
    const [loading, setLoading] = useState(true);

    // access NavBar context to set active state
    const { setState } = useNavBarContext();
    setState("matchPredict");
    
    // State variables for tournaments, selected tournament, and match results
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
    const [matchResults, setMatchResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [predictionResults, setPredictionResults] = useState<any[]>([]);

    // fetch tournaments data when the component is mounted
    useEffect(() => {
        fetchTournaments();
    }, []);

    // fetch all tournaments from the API and combine data from different statuses
    const fetchTournaments = async () => {
        setLoading(true);
        try {
            const combinedTournaments = await getCombinedTournaments();
            setTournaments(combinedTournaments);

            // auto-select the first tournament if available
            if (combinedTournaments.length > 0) {
                const firstTournamentId = combinedTournaments[0].id.toString();
                setSelectedTournamentId(firstTournamentId);
                await fetchTournamentDetails(firstTournamentId);
            }
        } catch (err) {
            handleError("Failed to fetch tournaments.");
        } finally {
            setLoading(false);
        }
    };

    // helper to combine data from "Matchmake" and "Ongoing" tournaments
    const getCombinedTournaments = async (): Promise<Tournament[]> => {
        const [matchmakeData, ongoingData] = await Promise.all([
            fetchTournamentsByStatus("Matchmake"),
            fetchTournamentsByStatus("Ongoing"),
        ]);
        return [...matchmakeData, ...ongoingData];
    };

    // fetch details of the selected tournament and enrich match data
    const fetchTournamentDetails = async (tournamentId: string) => {
        setLoading(true);
        try {
            const matchDetails = await getEnrichedMatchData(tournamentId);
            setMatchResults(matchDetails);
        } catch (err) {
            handleError("Failed to fetch tournament details.");
        } finally {
            setLoading(false);
        }
    };

    // enrich match data with player details
    const getEnrichedMatchData = async (tournamentId: string) => {
        const playersData = await fetchAllPlayersByTournament(Number(tournamentId));
        const fullPlayersData = await getAllPlayerDetails(playersData);
        const matchesData = await fetchMatchByTournamentId(Number(tournamentId));

        // map match data with enriched player information
        return matchesData.map((match) => ({
            ...match,
            player1: Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.player1Id) || null : null,
            player2: Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.player2Id) || null : null,
            winner: Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.winnerId) || null : null
        }));
    };

    // error handler to log and set error messages
    const handleError = (message: string) => {
        setError(message);
    };

    // handle tournament selection change
    const handleTournamentChange = async (value: string) => {
        setSelectedTournamentId(value);
        await fetchTournamentDetails(value);
    };

    // handle single prediction request
    const handlePrediction = async () => {
        if (!selectedTournamentId) return;
        setLoading(true);
        try {
            const results = await predictTournament(Number(selectedTournamentId));
            const enrichedResults = await enrichPredictedMatches(results, selectedTournamentId);
            setMatchResults(enrichedResults);
        } catch (err) {
            handleError("Failed to predict tournament results.");
        } finally {
            setLoading(false);
        }
    };

    // enrich prediction results with player data
    const enrichPredictedMatches = async (matches: any[], tournamentId: string) => {
        const playersData = await fetchAllPlayersByTournament(Number(tournamentId));
        const fullPlayersData = await getAllPlayerDetails(playersData);

        // map results to include enriched player details
        return matches.map((match) => ({
            ...match,
            player1: Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.player1Id) || null : null,
            player2: Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.player2Id) || null : null,
            winner: Array.isArray(fullPlayersData) ? fullPlayersData.find((player: PlayerResponse) => player.id === match.winnerId) || null : null,
            scores: match.games.map((game: { player1Score: any; player2Score: any; }) => `${game.player1Score}-${game.player2Score}`).join(' / ')
        }));
    };

    // handle prediction request for 1000 simulations
    const handlePrediction1000 = async () => {
        if (!selectedTournamentId) return;
        setLoading(true);
        try {
            const results = await predictTournament1000(Number(selectedTournamentId));
            // sort results based on rank
            setPredictionResults(results.sort((a, b) => a.rank - b.rank));
        } catch (err) {
            handleError("Failed to predict 1000 times.");
        } finally {
            setLoading(false);
        }
    };

    // display error message if an error occurs
    if (error) {
        return <ErrorDisplay message={error} />;
    }

    return (
        <div className="w-[80%] h-full mx-auto py-16">
            <h1 className="text-3xl font-bold text-start">Predict results for tournaments</h1>
            <div className="flex flex-row items-center gap-2">
                {/* dropdown to select a tournament */}
                <TournamentSelect
                    tournaments={tournaments}
                    selectedTournamentId={selectedTournamentId}
                    onChange={handleTournamentChange}
                />

                {/* button to predict results */}
                <Button variant="outline" className="hover:bg-red-700 hover:text-white" onClick={handlePrediction}>Predict</Button>

                {/* dialog to display results of 1000 predictions */}
                <PredictionDialog
                    results={predictionResults}
                    onTrigger={handlePrediction1000}
                />
            </div>

            {/* show loading indicator, tournament results, or "no tournaments" message */}
            {loading ? (
                <Loading />
            ) : tournaments.length > 0 ? (
                <div className="results">
                    <TournamentResultTable matchResult={matchResults} />
                </div>
            ) : (
                <NoTournamentDisplay />
            )}
        </div>
    );
}