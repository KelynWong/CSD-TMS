// Component to display tournament format and players

import { TournamentDetails } from "@/types/tournamentDetails";
import CarouselComponent from "./CarouselComponent";

/**
 * TournamentFormatAndPlayers Component
 * 
 * Renders the tournament format information and a carousel of players if the tournament is active.
 * 
 * Props:
 * - tournamentDetails: Details of the tournament, including players, format, and status.
 */
const TournamentFormatAndPlayers = ({ tournamentDetails } : { tournamentDetails: TournamentDetails }) => {
    // Check if the tournament is active (Matchmake, Ongoing, or Completed)
    const isActive = ["Matchmake", "Ongoing", "Completed"].includes(
        tournamentDetails.status
    );

    return (
        <div className="w-full formatPlayer my-5 flex gap-4">
            {/* Format Section */}
            <div
                className={`${
                    isActive ? "w-3/5" : "w-full" // Adjust width based on tournament status
                } border border-slate-200 bg-white rounded-lg font-body`}
            >
                {/* Section Title */}
                <h2 className="text-lg border-b border-slate-200 bg-slate-100 rounded-t-lg font-body font-bold px-6 py-3 uppercase">formats</h2>
                
                {/* Format Details */}
                <div className="p-6 pt-4 pb-16 text-slate-600">
                    {/* Participants Information */}
                    <p className="mb-2">Participants</p>
                    <ul className="ml-3 list-disc list-inside">
                        <li>There is no limit on how many players/teams participate in the tournament</li>
                        <li>Players/teams are paired randomly for the first round, regardless of ranking or past performance.</li>
                    </ul>

                    {/* Tournament Format Information */}
                    <p className="my-2">Format</p>
                    <ul className="ml-3 list-disc list-inside">
                        <li>Single elimination format</li>
                        <li>All matches are best of 3 games (Bo3)</li>
                        <li>Each game is played to 21 points (with a 2-point advantage required)</li>
                        <li>In case of a tie at 20-20, the game continues until one player/team leads by 2 points</li>
                    </ul>

                    {/* Qualification Information */}
                    <p className="my-2">Qualification to Next Events</p>
                    <ul className="ml-3 list-disc list-inside">
                        <li>First-round matchups are either random or determined based on entry order, with no predefined seeding.</li>
                        <li>Subsequent rounds continue in a single-elimination format, with the winners advancing to the next stage.</li>
                        <li>The winner qualifies directly for the next round or a higher-level tournament.</li>
                    </ul>
                </div>
            </div>

            {/* Players Section */}
            {isActive && (
                <div className="w-2/5 rounded-lg font-body bg-slate-100 relative">
                    {/* Section Title */}
                    <h2 className="text-lg rounded-t-lg font-body font-bold px-6 p-4 uppercase">Players</h2>
                    
                    {/* Carousel of Players */}
                    <CarouselComponent
                        tournament={{
                            ...tournamentDetails,// Spread tournament details
                            players: tournamentDetails.players ?? [], // Fallback to empty array if no players
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default TournamentFormatAndPlayers;