import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; // Importing select components for dropdown functionality
import { Tournament } from "@/types/tournament"; // Importing the Tournament type for type-checking

// TournamentSelect Component
// Dropdown component for selecting a tournament
// Props:
// - tournaments: Array of Tournament objects to display in the dropdown.
// - selectedTournamentId: ID of the currently selected tournament.
// - onChange: Callback function triggered when a new tournament is selected.
const TournamentSelect = ({ tournaments, selectedTournamentId, onChange }: any) => (
    <Select value={selectedTournamentId} onValueChange={onChange}> 
        {/* Trigger for the dropdown */}
        <SelectTrigger className="w-[320px] my-6 text-md">
            <SelectValue placeholder="Pick a Tournament" />
        </SelectTrigger>

        {/* Dropdown content */}
        <SelectContent>
            {/* Grouping the tournament options */}
            <SelectGroup>
                {/* Sort tournaments alphabetically by name and render as options */}
                {tournaments
                    .sort((a: Tournament, b: Tournament) => a.tournamentName.localeCompare(b.tournamentName))
                    .map((tournament: Tournament) => (
                        <SelectItem key={tournament.id} value={tournament.id.toString()}>
                            {tournament.tournamentName} {/* Display the tournament name */}
                        </SelectItem>
                    ))}
            </SelectGroup>
        </SelectContent>
    </Select>
);

export default TournamentSelect;