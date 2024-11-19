/**
 * Renders the list of tournaments for a specific tab
 */

import { Tournament } from "@/types/tournament";
import TournamentCard from "./TournamentCard";
import Pagination from "./Pagination";

/**
 * Props for the TournamentList Component
 * - tournaments: Array of tournaments to display.
 * - totalPages: Total number of pages for pagination.
 * - currentPage: Current active page.
 * - onPageChange: Callback to handle page changes.
 * - role: User's role (e.g., "PLAYER", "ADMIN").
 * - tab: The current tab name (e.g., "ongoing", "completed").
 */
const TournamentList = ({
    tournaments, // List of tournaments to display
    totalPages, // Total number of pages
    currentPage, // Current active page
    onPageChange, // Callback for page change
    role, // User role
}: {
    tournaments: Tournament[]; // Array of tournament objects
    totalPages: number; // Total number of pages
    currentPage: number; // Current page number
    onPageChange: (page: number) => void; // Page change handler
    role: string | null; // User role
}) => (
    <>
        {/* Grid layout for tournaments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
            {/* Show a message if no tournaments are found */}
            {tournaments.length === 0 ? (
                <div className="col-span-full text-center text-md italic mt-8">
                    No tournaments found.
                </div>
            ) : (
                /* Render a TournamentCard for each tournament */
                tournaments.map((tournament) => <TournamentCard key={tournament.id} {...tournament} role={role} />)
            )}
        </div>

        {/* Display pagination if there are multiple pages */}
        {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        )}
    </>
);

export default TournamentList;