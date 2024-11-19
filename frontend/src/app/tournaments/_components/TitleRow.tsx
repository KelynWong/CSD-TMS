import Link from "next/link"; // Link component for navigation
import { CirclePlus } from "lucide-react"; // Icon for the "Create New" button
import { Button } from "@/components/ui/button"; // Reusable button component

/**
 * TitleRow Component
 * 
 * Displays a title for the current tab and, if the user has the "ADMIN" role,
 * renders a button to create a new tournament.
 * 
 * Props:
 * - tab: The current tab name (e.g., "ongoing", "completed").
 * - role: The user's role (e.g., "ADMIN" or null).
 */
const TitleRow = ({ tab, role }: { tab: string; role: string | null }) => (
    <div className="flex items-center justify-between">
        {/* Display the title of the current tab */}
        <h1 className="text-3xl mr-5">
            {/* Capitalize the first letter of the tab name */}
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Tournaments
        </h1>

        {/* Render the "Create New" button if the user has the "ADMIN" role */}
        {role === "ADMIN" && (
            <Link href="/tournaments/form/create" prefetch={true}>
                <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
                    <CirclePlus className="mr-2" size={18} />
                    Create New
                </Button>
            </Link>
        )}
    </div>
);

export default TitleRow;