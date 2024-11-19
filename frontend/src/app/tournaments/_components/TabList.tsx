/**
 * Renders a list of tabs and their triggers.
 * Each tab displays its name and, if active, a badge showing the corresponding tournament count.
 */

import { Count } from "@/types/categoryCount"; // Import type for tournament counts
import { TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import tab components
import { Badge } from "@/components/ui/badge"; // Import badge component for displaying counts

/**
 * TabList Component
 * 
 * Props:
 * - tabs: An array of tab names (e.g., "upcoming", "ongoing", "completed").
 * - activeTab: The currently active tab.
 * - tournamentCount: An object containing the count of tournaments for each tab.
 */
const TabList = ({
    tabs, // Array of tab names
    activeTab, // Currently active tab name
    tournamentCount, // Object with tournament counts by category
}: {
    tabs: readonly string[]; // Tabs array is immutable
    activeTab: string; // Name of the currently active tab
    tournamentCount: Count; // Counts of tournaments for each tab
}) => (
    // Container for the list of tabs
    <TabsList className="TabsList px-2 py-6 rounded-lg">
        {/* Map through the tabs array to generate individual triggers */}
        {tabs.map((tab: string) => (
            <TabsTrigger key={tab} value={tab} className="TabsTrigger text-base px-4 py-1">
                {/* Display the tab name with the first letter capitalized */}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}

                {/* Show a badge with the count if the tab is active */}
                {activeTab === tab && <Badge className="ml-2 px-1.5">{tournamentCount[tab]}</Badge>}
            </TabsTrigger>
        ))}
    </TabsList>
);

export default TabList;