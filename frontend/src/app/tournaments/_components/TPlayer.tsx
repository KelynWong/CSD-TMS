import { Player } from '@/types/tournamentDetails';
import Lookup from 'country-code-lookup';

const TPlayer = ({ player }: { player: Player }) => {

    // Lookup the country name to get the country code
    var country = Lookup.byCountry(player?.country || "Sg") || 
                    Lookup.byInternet(player?.country || "Sg") || 
                    Lookup.byIso(player?.country || "Sg");
    const countryCode = country ? country.iso2 : null;

    // Handle missing country code cases
    if (!countryCode) {
        console.error(`Country code not found for: ${player?.country || "Unknown"}`);
    }
    
    return (
        <>
            <img src={`https://flagcdn.com/w320/${countryCode?.toLowerCase()}.png`} alt={player?.country || "Unknown"} className="rounded-full object-cover w-6 h-6" />
            <p className="w-full font-medium truncate">{player?.fullname || "Unknown Player"}</p>                                
        </>
    );
};

export default TPlayer;