/**
 * Renders the list of tournaments for a specific tab
 */

import { Tournament } from "@/types/tournament";
import TournamentCard from "./TournamentCard";
import Pagination from "./Pagination";

const TournamentList = ({
    tournaments,
    totalPages,
    currentPage,
    onPageChange,
    role,
    tab,
}: {
    tournaments: Tournament[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    role: string | null;
    tab: string;
}) => (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
            {tournaments.length === 0 ? (
                <div className="col-span-full text-center text-md italic mt-8">
                    No tournaments found.
                </div>
            ) : (
                tournaments.map((tournament) => <TournamentCard key={tournament.id} {...tournament} role={role} />)
            )}
        </div>

        {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        )}
    </>
);

export default TournamentList;