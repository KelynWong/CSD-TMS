import axios from "axios";
const URL = process.env.NEXT_PUBLIC_MATCH_API_URL;

export type GameResponse = {
	id: number;
	setNum: number;
	player1Score: number;
	player2Score: number;
};

export type MatchResponse = {
	id: number;
	tournamentId: number;
	player1Id: string;
	player2Id: string;
	winnerId: string;
	left: string;
	right: string;
	roundNum: number;
	games: GameResponse[];
};

export type MatchPlayerStatistic = {
	id: string;
	wins: number;
	losses: number;
	gamesPlayed: number;
};

const getCookies = (): { [key: string]: string } => {
	const cookies: { [key: string]: string } = {};
	document.cookie.split(";").forEach((cookie) => {
		const [name, value] = cookie.split("=").map((c) => c.trim());
		cookies[name] = decodeURIComponent(value);
	});

	return cookies;
};

export const getJwtToken = (): string | null => {
	const cookies = getCookies();
	return cookies["__session"] || null;
};

export const fetchMatchByTournamentId = async (
	tournament_id: number
): Promise<any[]> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/tournament/${tournament_id}`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
			
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching matches", error);
		throw error;
	}
};

export const fetchGamesByMatchId = async (match_id: number): Promise<any[]> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/${match_id}/games`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
			
		});

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
		const jwtToken = getJwtToken();
		const winResponse = await axios.get(`${URL}/user/win/${Id}`);
		const wins = winResponse.data.length;
		const lossResponse = await axios.get(`${URL}/user/loss/${Id}`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
			
		});
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

export const fetchPlayerMatches = async (
	Id: string
): Promise<MatchResponse[]> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/user/played/${Id}`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching player matches", error);
		throw error;
	}
};
