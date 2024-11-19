// Component to display results

import { TournamentDetails } from "@/types/tournamentDetails";
import TournamentResultTable from "./TournamentResultTable";

/**
 * TournamentResults Component
 * 
 * Displays the results of a tournament in a table format.
 * - Only renders results if the tournament is active and has matches.
 * 
 * Props:
 * - tournamentDetails: Object containing all details of the tournament, including matches and status.
 */
const TournamentResults = ({ tournamentDetails } : { tournamentDetails: TournamentDetails }) => {
    // Check if the tournament is active (Matchmake, Ongoing, or Completed)
    const isActive = ["Matchmake", "Ongoing", "Completed"].includes(
        tournamentDetails.status
    );

    // Render the results if the tournament is active and matches exist
    return isActive && (
        <>
            {/* Display results section only if matches exist */}
            {tournamentDetails.matches.length > 0 && (
                <div className="w-full my-5 results">
                    {/* Section Title */}
                    <h2 className="text-lg rounded-t-lg font-body font-bold pb-2 uppercase">Results</h2>

                    {/* Tournament Results Table */}
                    <TournamentResultTable matchResult={tournamentDetails.matches} />
                </div>
            )}
        </>
    );
};

export default TournamentResults;