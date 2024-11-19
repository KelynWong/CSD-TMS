/**
 * Displays a section with statistics for tournaments
 */

import { Count } from "@/types/categoryCount";
import { BicepsFlexed, Medal, PartyPopper } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StatsSection = ({ tournamentCount }: { tournamentCount: Count }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 md:mb-9 lg:mb-11">
        {[
            { label: "Upcoming", count: tournamentCount.upcoming, icon: <PartyPopper size={28} /> },
            { label: "Ongoing", count: tournamentCount.ongoing, icon: <BicepsFlexed size={28} /> },
            { label: "Completed", count: tournamentCount.completed, icon: <Medal size={28} /> },
        ].map(({ label, count, icon }) => (
            <Card key={label}>
                <CardHeader>
                    <CardTitle className="text-2xl flex justify-between">
                        {label} {icon}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-heading font-bold">{count}</div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export default StatsSection;