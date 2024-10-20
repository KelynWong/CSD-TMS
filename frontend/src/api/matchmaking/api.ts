import axios from "axios";

const URL = process.env.NEXT_PUBLIC_MATCHMAKING_API_URL;

type Game = {
	setNum: number;
	player1Score: number;
	player2Score: number;
};

type Games = Game[];

export const fetchMatchMakingByTournamentId = async (tournament_id: number): Promise<any[]> => {
	try {
		const response = await axios.get(`${URL}/${tournament_id}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching tournament matchemaking data", error);
		throw error;
	}
};

export const matchMakeByTournamentId = async (tournament_id: number): Promise<boolean> => {
	try {
		const response = await axios.post(`${URL}/${tournament_id}`);
		console.log(response);
		return response.status === 200; 
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			// TypeScript now knows that `error` is an AxiosError
			if (error.response) {
				console.log(error.response.data.error);
				throw error.response.data.error
			} else {
				console.log('Error', error.message);
				throw error.message
			}
		} else {
			// Handle errors that are not related to Axios
			console.log('Unknown error', error);
			throw error;
		}
	}
};

export const addGamesByMatchId = async (match_id: number, gamesData: Games): Promise<boolean> => {
	try {
		console.log(`${URL}/result/${match_id}`);
		const response = await axios.post(`${URL}/result/${match_id}`, gamesData, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		console.log(response);
		return response.status === 200; 
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			// TypeScript now knows that `error` is an AxiosError
			if (error.response) {
				console.log(error.response.data.error);
				throw error.response.data.error
			} else {
				console.log('Error', error.message);
				throw error.message
			}
		} else {
			// Handle errors that are not related to Axios
			console.log('Unknown error', error);
			throw error;
		}
	}
};