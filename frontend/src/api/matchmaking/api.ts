import axios from "axios";

// Define the base URL for the matchmaking API
const URL = process.env.NEXT_PUBLIC_MATCHMAKING_API_URL;

// Define the structure of a game
type Game = {
	setNum: number;
	player1Score: number;
	player2Score: number;
};

// Define the structure of a collection of games
type Games = Game[];

// Function to parse document cookies into a key-value object
/**
 * Parses the document's cookies and returns an object with cookie names as keys and their values as values.
 * 
 * @returns An object where each key is a cookie name and its value is the corresponding cookie value.
 */
const getCookies = (): { [key: string]: string } => {
	const cookies: { [key: string]: string } = {};
	document.cookie.split(";").forEach((cookie) => {
		const [name, value] = cookie.split("=").map((c) => c.trim());
		cookies[name] = decodeURIComponent(value);
	});

	return cookies;
};

// Function to retrieve the JWT token from cookies
/**
 * Retrieves the JWT token from the document's cookies.
 * 
 * @returns The JWT token if found, otherwise null.
 */
export const getJwtToken = (): string | null => {
	const cookies = getCookies(); 
	return cookies["__session"] || null; 
};

// Function to matchmake by tournament ID and strategy
/**
 * Initiates matchmaking for a tournament based on the tournament ID and strategy.
 * 
 * @param tournament_id The ID of the tournament for which matchmaking is to be initiated.
 * @param strategy The strategy to use for matchmaking.
 * @returns A promise that resolves to a boolean indicating the success of the matchmaking process.
 */
export const matchMakeByTournamentId = async (tournament_id: number, strategy: string): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.post(`${URL}/${tournament_id}/strategy/${strategy}`, {}, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});
		return response.status === 201 || response.status === 200; 
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			// Handle Axios errors
			if (error.response) {
				throw error.response.data.error
			} else {
				throw error.message
			}
		} else {
			// Handle errors that are not related to Axios
			throw error;
		}
	}
};

// Function to add games by match ID
/**
 * Adds games to a match based on the match ID.
 * 
 * @param match_id The ID of the match to which games are to be added.
 * @param gamesData The games data to be added.
 * @returns A promise that resolves to a boolean indicating the success of the operation.
 */
export const addGamesByMatchId = async (match_id: number, gamesData: Games): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.post(`${URL}/result/${match_id}`, gamesData, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});
		return response.status === 201 || response.status === 200; 
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			// Handle Axios errors
			if (error.response) {
				throw error.response.data.error
			} else {
				throw error.message
			}
		} else {
			// Handle errors that are not related to Axios
			throw error;
		}
	}
};

// Function to predict tournament
/**
 * Predicts the outcome of a tournament.
 * 
 * @param tournament_id The ID of the tournament to predict.
 * @returns A promise that resolves to an array of predictions.
 */
export const predictTournament = async (
	tournament_id: number
): Promise<any[]> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.get(`${URL}/matches/${tournament_id}/simulate`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});
		return response.data;
	} catch (error) {
		console.error("Error simulating matches", error);
		throw error;
	}
};

// Function to predict tournament 1000 times
/**
 * Predicts the outcome of a tournament 1000 times.
 * 
 * @param tournament_id The ID of the tournament to predict.
 * @returns A promise that resolves to an array of predictions.
 */
export const predictTournament1000 = async (
	tournament_id: number
): Promise<any[]> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.get(`${URL}/matches/${tournament_id}/simulate-many`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});
		return response.data;
	} catch (error) {
		console.error("Error simulating matches", error);
		throw error;
	}
};