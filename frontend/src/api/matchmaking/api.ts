import axios from "axios";

// const URL = process.env.NEXT_PUBLIC_MATCHMAKING_API_URL;
const URL = '/api/matchmaking';

type Game = {
	setNum: number;
	player1Score: number;
	player2Score: number;
};

type Games = Game[];

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

export const matchMakeByTournamentId = async (tournament_id: number, strategy: string): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken(); 
		console.log("testing if matchMakeByTournament strategy shows", strategy);
		const response = await axios.post(`${URL}/${tournament_id}`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
			withCredentials: true,
		});
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
		const jwtToken = getJwtToken(); 
		const response = await axios.post(`${URL}/result/${match_id}`, gamesData, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwtToken}`,
			},
			withCredentials: true,
		});
		return response.status === 201 || response.status === 200; 
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

export const predictTournament = async (
	tournament_id: number
): Promise<any[]> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.get(
			`${URL}/matches/${tournament_id}/simulate`,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				withCredentials: true,
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error simulating matches", error);
		throw error;
	}
};

export const predictTournament1000 = async (
	tournament_id: number
): Promise<any[]> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.get(
			`${URL}/matches/${tournament_id}/simulate-many`,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				withCredentials: true,
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error simulating matches", error);
		throw error;
	}
};