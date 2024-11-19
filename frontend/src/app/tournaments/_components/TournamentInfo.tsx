// Component to display tournament information

import type { TournamentDetails } from "@/types/tournamentDetails";

/**
 * TournamentInfo Component
 * 
 * Displays detailed information about a tournament, including:
 * - Organizer
 * - Registration period
 * - Tournament start and end dates
 * - Tournament status
 * - Number of matches
 * - Matching format
 * 
 * Props:
 * - tournamentDetails: Object containing all details of the tournament.
 * - totalMatches: Total number of matches in the tournament.
 * - formatDateTime: Function to format date strings into readable date and time.
 */
const TournamentInfo = ({ tournamentDetails, totalMatches, formatDateTime }: { tournamentDetails: TournamentDetails, totalMatches: number, formatDateTime: (date: string) => { date: string, time: string } }) => {
    // Format registration start and end times
    const regStart = formatDateTime(tournamentDetails.regStartDT);
    const regEnd = formatDateTime(tournamentDetails.regEndDT);

    // Format tournament start and end times
    const start = formatDateTime(tournamentDetails.startDT);
    const end = formatDateTime(tournamentDetails.endDT);

    return (
        <div className="w-full border border-slate-200 bg-white rounded-t-lg font-body">
            {/* Section Title */}
            <h2 className="text-lg border-b border-slate-200 bg-slate-100 rounded-t-lg font-body font-bold px-6 py-3 uppercase">Tournament Information</h2>
            
            {/* Tournament Details */}
            <div className="text-slate-600">
                {/* Organizer */}
                <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                    <span className="w-8/12">Organizer:</span>
                    <span className="w-4/12">{tournamentDetails.organizer}</span>
                </div>

                {/* Registration Period */}
                <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                    <span className="w-8/12">Registration:</span>
                    <span className="w-4/12">Start: {regStart.date}, {regStart.time}<br />End: {regEnd.date}, {regEnd.time}</span>
                </div>

                {/* Tournament Period */}
                <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                    <span className="w-8/12">Tournament:</span>
                    <span className="w-4/12">Start: {start.date}, {start.time}<br />End: {end.date}, {end.time}</span>
                </div>

                {/* Tournament Status */}
                <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                    <span className="w-8/12">Status: </span>
                    <span className="w-4/12">{tournamentDetails.status}</span>
                </div>

                {/* Number of Matches */}
                <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                    <span className="w-8/12">No. of Match: </span>
                    <span className="w-4/12">{totalMatches === 0 ? 'TBC' : totalMatches}</span>
                </div>

                {/* Matching Format */}
                <div className="flex justify-between px-6 py-3 font-semibold">
                    <span className="w-8/12">Format:</span>
                    <span className="w-4/12">Automatic Matching</span>
                </div>
            </div>
        </div>
    );
};

export default TournamentInfo;