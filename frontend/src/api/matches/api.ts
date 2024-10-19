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

export type MatchPlayerStatistic = {
	id: string;
	wins: number;
	losses: number;
	gamesPlayed: number;
};

export const fetchMatchByTournamentId = async (
	tournament_id: number
): Promise<any[]> => {
	try {
		// console.log(`${URL}/matches/tournament/${id}`);

		const response = await axios.get(
			`${URL}/matches/tournament/${tournament_id}`
		);
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
		console.error("Error fetching matches", error);
		throw error;
	}
};

export const fetchGamesByMatchId = async (match_id: number): Promise<any[]> => {
	try {
		// console.log(`${URL}/matches/${match_id}/games`);

		const response = await axios.get(`${URL}/matches/${match_id}/games`);

		return response.data;
	} catch (error) {
		console.error("Error fetching games", error);
		throw error;
	}
};

export const updateGamesByGameId = async (match_id: number, gameData: Partial<GameResponse>): Promise<boolean> => {
	try {
		console.log(`${URL}/matches/${match_id}/games/${gameData.id}`);

		const response = await axios.put(`${URL}/matches/${match_id}/games/${gameData.id}`, gameData, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		return response.status === 200; 
	} catch (error) {
		console.error("Error updating game score", error);
		return false;
	}
};

export const fetchPlayerStats = async (
	Id: string
): Promise<MatchPlayerStatistic> => {
	try {
		const winResponse = await axios.get(`${URL}/matches/user/win/${Id}`);
		const wins = winResponse.data.length;
		const lossResponse = await axios.get(`${URL}/matches/user/loss/${Id}`);
		const losses = lossResponse.data.length;
		const gamesPlayed = wins + losses;
		const mappedData: MatchPlayerStatistic = {
			id: Id,
			wins: wins,
			losses: losses,
			gamesPlayed: gamesPlayed,
		};
		return mappedData;
	} catch (error) {
		console.error("Error fetching player stats", error);
		throw error;
	}
};
