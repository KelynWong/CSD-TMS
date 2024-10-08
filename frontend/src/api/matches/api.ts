import axios from "axios";

const URL = "http://localhost:8080";

type GameResponse = {
    id: number;
    setNum: number;
    player1Score: number;
    player2Score: number;
};

type MatchResponse = {
    id: number;
    tournamentId: number;
    player1Id: string;
    player2Id: string;
    winnerId: string;
    left: string;
    right: string;
    games: GameResponse[];
};

export const fetchMatchByTournamentID = async (id: number): Promise<MatchResponse[]> => {
	try {
		console.log(`${URL}/matches/tournaments/${id}`);

		const response = await axios.get(`${URL}/tournaments`);
		const formattedData: MatchResponse[] = response.data.map((match: any) => ({
			id: match.id,
			tournamentId: match.tournamentId,
			player1Id: match.player1Id,
			player2Id: match.player2Id,
			winnerId: match.winnerId,
			left: match.left,
			right: match.right,
			games: match.games
		}));
		console.log(formattedData);
		return formattedData;
	} catch (error) {
		console.error("Error fetching matches", error);
		throw error;
	}
};