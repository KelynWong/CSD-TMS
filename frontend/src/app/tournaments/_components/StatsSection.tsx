/**
 * Displays a section with statistics for tournaments.
 * This component renders a grid of cards showing the count of upcoming, ongoing, and completed tournaments.
 */

import { Count } from "@/types/categoryCount"; // Import type for tournament count structure
import { BicepsFlexed, Medal, PartyPopper } from "lucide-react"; // Import icons for the stats
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Import card components for layout

// Component Props
// - tournamentCount: An object containing counts of upcoming, ongoing, and completed tournaments.
const StatsSection = ({ tournamentCount }: { tournamentCount: Count }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 md:mb-9 lg:mb-11">
        {/* Array of statistics to display */}
        {[
            {
                label: "Upcoming", // Label for upcoming tournaments
                count: tournamentCount.upcoming, // Count of upcoming tournaments
                icon: <PartyPopper size={28} />, // Icon for upcoming tournaments
            },
            {
                label: "Ongoing", // Label for ongoing tournaments
                count: tournamentCount.ongoing, // Count of ongoing tournaments
                icon: <BicepsFlexed size={28} />, // Icon for ongoing tournaments
            },
            {
                label: "Completed", // Label for completed tournaments
                count: tournamentCount.completed, // Count of completed tournaments
                icon: <Medal size={28} />, // Icon for completed tournaments
            },
        ].map(({ label, count, icon }) => (
            // Render a card for each statistic
            <Card key={label}>
                {/* Card Header */}
                <CardHeader>
                    <CardTitle className="text-2xl flex justify-between">
                        {label} {icon} {/* Label n Icon for the card */}
                    </CardTitle>
                </CardHeader>

                {/* Card Content */}
                <CardContent>
                    {/* Display the count with bold and prominent styling */}
                    <div className="text-3xl font-heading font-bold">{count}</div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export default StatsSection;