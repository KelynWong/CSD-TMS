import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tournament } from "@/types/tournament";

// Dropdown component for selecting tournaments
const TournamentSelect = ({ tournaments, selectedTournamentId, onChange }: any) => (
    <Select value={selectedTournamentId} onValueChange={onChange}>
        <SelectTrigger className="w-[320px] my-6 text-md">
            <SelectValue placeholder="Pick a Tournament" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {tournaments
                    .sort((a: Tournament, b: Tournament) => a.tournamentName.localeCompare(b.tournamentName))
                    .map((tournament: Tournament) => (
                        <SelectItem key={tournament.id} value={tournament.id.toString()}>
                            {tournament.tournamentName}
                        </SelectItem>
                    ))}
            </SelectGroup>
        </SelectContent>
    </Select>
);

export default TournamentSelect;