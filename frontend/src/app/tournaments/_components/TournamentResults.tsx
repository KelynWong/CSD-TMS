// Component to display results

import { TournamentDetails } from "@/types/tournamentDetails";
import TournamentResultTable from "./TournamentResultTable";

const TournamentResults = ({ tournamentDetails } : { tournamentDetails: TournamentDetails }) => {
    const isActive = ["Matchmake", "Ongoing", "Completed"].includes(
        tournamentDetails.status
    );

    return isActive && (
        <>
            {tournamentDetails.matches.length > 0 && (
                <div className="w-full my-5 results">
                    <h2 className="text-lg rounded-t-lg font-body font-bold pb-2 uppercase">Results</h2>
                    <TournamentResultTable matchResult={tournamentDetails.matches} />
                </div>
            )}
        </>
    );
};

export default TournamentResults;