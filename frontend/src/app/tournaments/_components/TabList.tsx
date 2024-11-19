/**
 * Renders a list of tabs and their triggers
 */

import { Count } from "@/types/categoryCount";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const TabList = ({
    tabs,
    activeTab,
    tournamentCount,
}: {
    tabs: readonly string[];
    activeTab: string;
    tournamentCount: Count;
}) => (
    <TabsList className="TabsList px-2 py-6 rounded-lg">
        {tabs.map((tab: string) => (
            <TabsTrigger key={tab} value={tab} className="TabsTrigger text-base px-4 py-1">
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && <Badge className="ml-2 px-1.5">{tournamentCount[tab]}</Badge>}
            </TabsTrigger>
        ))}
    </TabsList>
);

export default TabList;