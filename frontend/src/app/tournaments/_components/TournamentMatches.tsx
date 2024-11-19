import { TournamentDetails } from "@/types/tournamentDetails";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { CirclePlus } from "lucide-react";
import SetEditForm from "./SetEditForm";

/**
 * Component to display matches for a tournament.
 * - Shows match details, player names, and game results.
 * - Allows admins to add game results when matches have no games recorded.
 * 
 * Props:
 * - tournamentDetails: Details of the tournament, including matches and status.
 * - role: The role of the user (e.g., "ADMIN", "PLAYER").
 */
const TournamentMatches = ({ tournamentDetails, role } : { tournamentDetails: TournamentDetails, role: string }) => {
    // Check if the tournament is active (Ongoing or Completed)
    const isActive = ["Ongoing", "Completed"].includes(
        tournamentDetails.status
    );

    // Render only if the tournament is active
    return isActive && (
        <>
            {/* Display matches if there are any */}
            {tournamentDetails.matches.length > 0 && (
                <div className="w-full my-5 matches">
                    {/* Section Title */}
                    <h2 className="text-lg rounded-lg font-body font-bold pb-2 uppercase">Matches</h2>
                    
                    {/* Matches Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {tournamentDetails?.matches?.map((match, matchIndex: number) => (
                            // Only render matches with valid player data
                            (match.player1 !== null && match.player2 !== null) && (
                                <div key={match.id} className="w-full border border-slate-200 bg-white rounded-lg font-body">
                                    {/* Match Header */}
                                    <div className="border-b border-slate-200 bg-slate-100 rounded-t-lg flex justify-between items-center px-6 py-3">
                                        <h2 className="text-base font-body font-bold uppercase">{`Match ${matchIndex + 1} - ${match.player1.fullname} vs ${match.player2.fullname}`}</h2>

                                        {/* Admin-only: Add game results */}
                                        {match.games.length === 0 && role === "ADMIN" && (
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <CirclePlus stroke="#ec4344" strokeWidth="3" size={21} />
                                                </SheetTrigger>

                                                {/* Sheet Content for Adding Game Results */}
                                                <SheetContent className="bg-white">
                                                    <SheetHeader className="mb-6">
                                                        <SheetTitle>Add Game Results for this Match</SheetTitle>
                                                        <SheetDescription>
                                                            <p className="text-red-500 font-bold">⚠️ Please ensure that the match is completed before submitting this form! ⚠️</p>
                                                            <p>Enter the scores for each player in each game.</p>
                                                        </SheetDescription>
                                                    </SheetHeader>

                                                    {/* Game Results Form */}
                                                    <SetEditForm
                                                        matchId={match.id}
                                                        // game={game}
                                                        player1Name={match.player1.fullname}
                                                        player2Name={match.player2.fullname}
                                                    />

                                                </SheetContent>
                                            </Sheet>
                                        )}
                                    </div>

                                    {/* Match Games Section */}
                                    <div className="text-slate-600">
                                        {match.games
                                            .sort((a, b) => a.setNum - b.setNum) // Sort games by setNum
                                            .map((game) =>
                                                <>
                                                    {/* Game Set Number */}
                                                    <div key={game.id} className="border-b border-slate-200 px-6 py-2 flex justify-between">
                                                        <p className="text-slate-500">{`Set ${game.setNum}`}</p>
                                                    </div>

                                                    {/* Player Scores */}
                                                    <div className="flex justify-center border-b border-slate-200">
                                                        {/* Player 1 Score */}
                                                        <div
                                                            className={`w-2/5 flex items-center justify-end gap-2 px-4 py-5 text-black font-bold ${(game.player1Score !== null && game.player2Score !== null) && game.player1Score > game.player2Score ? 'bg-green-100' : ''
                                                                }`}
                                                        >
                                                            <img src="/images/default_profile.png" className="rounded-full w-6 h-6" alt="Player Profile" />
                                                            <p>{match.player1.fullname} </p>
                                                        </div>

                                                        {/* Game Score */}
                                                        <div className="w-1/5 flex items-center justify-center gap-2 px-4 py-5 font-bold">
                                                            <p>{game.player1Score !== null ? game.player1Score : '?'} - {game.player2Score !== null ? game.player2Score : '?'}</p>
                                                        </div>

                                                        {/* Player 2 Score */}
                                                        <div
                                                            className={`w-2/5 flex items-center justify-start gap-2 px-4 py-5 text-black font-bold ${(game.player1Score !== null && game.player2Score !== null) && game.player1Score < game.player2Score ? 'bg-green-100' : ''
                                                                }`}
                                                        >
                                                            <img src="/images/default_profile.png" className="rounded-full w-6 h-6" alt="Player Profile" />
                                                            <p>{match.player2.fullname} </p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default TournamentMatches;