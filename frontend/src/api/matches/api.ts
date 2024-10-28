import axios from "axios";
const URL = process.env.NEXT_PUBLIC_MATCH_API_URL;

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
		const response = await axios.get(
			`${URL}/tournament/${tournament_id}`
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching matches", error);
		throw error;
	}
};

export const fetchGamesByMatchId = async (match_id: number): Promise<any[]> => {
	try {
		// console.log(`${URL}/${match_id}/games`);

		const response = await axios.get(`${URL}/${match_id}/games`);

		return response.data;
	} catch (error) {
		console.error("Error fetching games", error);
		throw error;
	}
};

export const fetchPlayerStats = async (
	Id: string
): Promise<MatchPlayerStatistic> => {
	try {
		const winResponse = await axios.get(`${URL}/user/win/${Id}`);
		const wins = winResponse.data.length;
		const lossResponse = await axios.get(`${URL}/user/loss/${Id}`);
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
