// Component to display tournament information

import type { TournamentDetails } from "@/types/tournamentDetails";

const TournamentInfo = ({ tournamentDetails, totalMatches, formatDateTime }: { tournamentDetails: TournamentDetails, totalMatches: number, formatDateTime: (date: string) => { date: string, time: string } }) => {
    const regStart = formatDateTime(tournamentDetails.regStartDT);
    const regEnd = formatDateTime(tournamentDetails.regEndDT);
    const start = formatDateTime(tournamentDetails.startDT);
    const end = formatDateTime(tournamentDetails.endDT);

    return (
        <div className="w-full border border-slate-200 bg-white rounded-t-lg font-body">
            <h2 className="text-lg border-b border-slate-200 bg-slate-100 rounded-t-lg font-body font-bold px-6 py-3 uppercase">Tournament Information</h2>
            <div className="text-slate-600">
                <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                    <span className="w-8/12">Organizer:</span>
                    <span className="w-4/12">{tournamentDetails.organizer}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                    <span className="w-8/12">Registration:</span>
                    <span className="w-4/12">Start: {regStart.date}, {regStart.time}<br />End: {regEnd.date}, {regEnd.time}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                    <span className="w-8/12">Tournament:</span>
                    <span className="w-4/12">Start: {start.date}, {start.time}<br />End: {end.date}, {end.time}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                    <span className="w-8/12">Status: </span>
                    <span className="w-4/12">{tournamentDetails.status}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                    <span className="w-8/12">No. of Match: </span>
                    <span className="w-4/12">{totalMatches === 0 ? 'TBC' : totalMatches}</span>
                </div>
                <div className="flex justify-between px-6 py-3 font-semibold">
                    <span className="w-8/12">Format:</span>
                    <span className="w-4/12">Automatic Matching</span>
                </div>
            </div>
        </div>
    );
};

export default TournamentInfo;