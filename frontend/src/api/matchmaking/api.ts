import axios from "axios";

const URL = "http://localhost:8081";

export const fetchMatchMakingByTournamentId = async (tournament_id: number): Promise<any[]> => {
	try {
		// console.log(`${URL}/matchmaking/${tournament_id}`);

		const response = await axios.get(`${URL}/matchmaking/${tournament_id}`);
		// const formattedData: MatchResponse[] = response.data.map((match: any) => ({
		// 	id: match.id,
		// 	tournamentId: match.tournamentId,
		// 	player1Id: match.player1Id,
		// 	player2Id: match.player2Id,
		// 	winnerId: match.winnerId,
		// 	left: match.left,
		// 	right: match.right,
		// 	games: match.games
		// }));
		
		return response.data;
	} catch (error) {
		console.error("Error fetching tournament matchemaking data", error);
		throw error;
	}
};