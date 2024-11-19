"use client";

import "../../tournaments/styles.css";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { fetchAllPlayersByTournament, fetchTournamentById } from "@/api/tournaments/api";
import { fetchMatchByTournamentId } from "@/api/matches/api";
import type { TournamentDetails, Match, Player } from "@/types/tournamentDetails";
import { useUserContext } from "@/context/userContext";
import { fetchOrganizer, fetchPlayer, fetchUser } from "@/api/users/api";
import { useNavBarContext } from "@/context/navBarContext";
import ErrorDisplay from "@/components/ErrorDisplay";
import TournamentInfo from "../_components/TournamentInfo";
import TournamentFormatAndPlayers from "../_components/TournamentFormatAndPlayers";
import TournamentResults from "../_components/TournamentResults";
import TournamentMatches from "../_components/TournamentMatches";

export default function TournamentDetails() {
    // set current navigation state
    const { setState } = useNavBarContext();
    setState("tournaments");

    // Parameters and states
    const { id } = useParams();
    const { user } = useUserContext(); // get user context for authentication and role
    const [role, setRole] = useState<string | null>(null); // user role (e.g., ADMIN)
    const [loading, setLoading] = useState(false); // loading indicator for fetching data
    const [error, setError] = useState<string | null>(null); // err msg if data fetch fails
    const [tournamentDetails, setTournamentDetails] = useState<TournamentDetails | null>(null);
    const sgTimeZoneOffset = 8 * 60 * 60 * 1000;

    // Fetch user role
    useEffect(() => {
        if (user) {
            fetchUserRole(user.id);
        }
    }, [user]);

    // Fetch tournament data
    useEffect(() => {
        fetchTournamentData();
    }, [id]);

    // Fetch the user's role based on their ID
    const fetchUserRole = async (userId: string) => {
		setLoading(true);
        try {
            const data = await fetchUser(userId);
            setRole(data.role); // set user's role (e.g., PLAYER, ADMIN)
        } catch (err) {
            setError("Failed to fetch user data."); // set error message
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    /**
     * Fetch tournament details, players, and matches based on the tournament ID
     */
    const fetchTournamentData = async () => {
        setLoading(true);
        try {
            const tournamentData = await fetchTournamentById(Number(id));
            const organizerData = await fetchOrganizer(tournamentData.createdBy);

            // Initialize basic tournament details
            const tournamentInfo: TournamentDetails = {
                ...tournamentData,
                startDT: adjustToSGTime(tournamentData.startDT),
                endDT: adjustToSGTime(tournamentData.endDT),
                regStartDT: adjustToSGTime(tournamentData.regStartDT),
                regEndDT: adjustToSGTime(tournamentData.regEndDT),
                organizer: organizerData,
                players: [], // Initialize players as empty
                matches: [], // Initialize matches with explicit type
            };

            // Check if matches and players need to be fetched
            if (["Matchmake", "Ongoing", "Completed"].includes(tournamentData.status)) {
                tournamentInfo.players = await fetchPlayers(Number(id));
                tournamentInfo.matches = await fetchMatches(Number(id), tournamentInfo.players);
            }

            setTournamentDetails(tournamentInfo);
        } catch (error) {
            console.error("Error fetching tournament data:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch players participating in the tournament
     */
    const fetchPlayers = async (tournamentId: number): Promise<Player[]> => {
        const players = await fetchAllPlayersByTournament(tournamentId);
        return Promise.all(
            players.map(async (player) => {
                const playerData = await fetchPlayer(player.id);
                return {
                    ...player,
                    ...playerData,
                };
            })
        );
    };

    /**
     * Fetch matches and enrich with player data
     */
    const fetchMatches = async (tournamentId: number, players: Player[]): Promise<Match[]> => {
        const matches = await fetchMatchByTournamentId(tournamentId);
        return matches.map((match) => ({
            ...match,
            player1: players.find((player) => player.id === match.player1Id) || null,
            player2: players.find((player) => player.id === match.player2Id) || null,
            winner: players.find((player) => player.id === match.winnerId) || null,
        }));
    };

    /**
     * Convert UTC date to Singapore timezone
     */
    const adjustToSGTime = (date: string): string =>
        new Date(new Date(date).getTime() + sgTimeZoneOffset).toISOString();

    /**
     * Format date and time for display
     */
    const formatDateTime = (date: string | undefined): { date: string; time: string } => {
        if (!date) return { date: "TBC", time: "TBC" };
        const dateObj = new Date(date);
        return {
            date: new Intl.DateTimeFormat("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(dateObj),
            time: new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }).format(dateObj),
        };
    };

    // Calculate total number of matches
    const totalMatches = tournamentDetails?.matches.length ?? null;

    // Display error message if something goes wrong
    if (error) {
        return <ErrorDisplay message={error} />;
    }

    // Show loading indicator while data is being fetched
    if (loading) return <Loading />;

    return (
        tournamentDetails ? (
            <div className="w-full">
                {/* Tournament Header */}
                <div className="w-full h-96 cardImg bg-center relative">
                    <div className="h-full overlay"></div>
                    <h1 className="w-[80%] text-4xl absolute top-2/4 left-2/4 text-white font-body font-bold text-center" style={{ transform: "translate(-50%, -50%)" }}>{tournamentDetails.tournamentName}</h1>
                </div>

                <div className="w-[80%] mx-auto py-16">
                    {/* Tournament Information */}
                    <TournamentInfo
                        tournamentDetails={tournamentDetails}
                        totalMatches={totalMatches ?? 0}
                        formatDateTime={formatDateTime}
                    />

                    {/* Format and Players */}
                    <TournamentFormatAndPlayers
                        tournamentDetails={tournamentDetails}
                    />

                    {/* Results */}
                    <TournamentResults
                        tournamentDetails={tournamentDetails}
                    />

                    {/* Matches */}
                    <TournamentMatches
                        tournamentDetails={tournamentDetails}
                        role={role ?? ""}
                    />
                </div>
            </div>
        ) : (
            <Loading />
        )
    );
}