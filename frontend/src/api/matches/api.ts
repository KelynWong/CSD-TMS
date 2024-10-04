import axios from "axios";

const URL = "http://localhost:8080";

export type MatchPlayerStatistic = {
	id: string;
	wins: number;
	losses: number;
	gamesPlayed: number;
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
