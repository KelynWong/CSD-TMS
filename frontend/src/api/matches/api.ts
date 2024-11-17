import axios from "axios";
// Define the base URL for the matches API
const URL = process.env.NEXT_PUBLIC_MATCH_API_URL;

// Define the structure of a game response
export type GameResponse = {
	id: number;
	setNum: number;
	player1Score: number;
	player2Score: number;
};

// Define the structure of a match response
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

// Define the structure of a match player statistic
export type MatchPlayerStatistic = {
	id: string;
	wins: number;
	losses: number;
	gamesPlayed: number;
};

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

// Function to fetch matches by tournament ID
/**
 * Fetches matches for a given tournament ID.
 *
 * @param tournament_id The ID of the tournament for which matches are to be fetched.
 * @returns A promise that resolves to an array of matches.
 */
export const fetchMatchByTournamentId = async (
	tournament_id: number
): Promise<any[]> => {
	try {
		const jwtToken = getJwtToken(); // Retrieve JWT token from cookies
		const response = await axios.get(`${URL}/tournament/${tournament_id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}, // Include JWT token in headers if available
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching matches", error);
		throw error;
	}
};

// Function to fetch games by match ID
/**
 * Fetches games for a given match ID.
 *
 * @param match_id The ID of the match for which games are to be fetched.
 * @returns A promise that resolves to an array of games.
 */
export const fetchGamesByMatchId = async (match_id: number): Promise<any[]> => {
	try {
		const jwtToken = getJwtToken(); // Retrieve JWT token from cookies
		const response = await axios.get(`${URL}/${match_id}/games`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}, // Include JWT token in headers if available
		});

		return response.data;
	} catch (error) {
		console.error("Error fetching games", error);
		throw error;
	}
};

// Function to fetch player statistics
/**
 * Fetches statistics for a given player ID.
 *
 * @param Id The ID of the player for whom statistics are to be fetched.
 * @returns A promise that resolves to the player's statistics.
 */
export const fetchPlayerStats = async (
	Id: string
): Promise<MatchPlayerStatistic> => {
	try {
		const jwtToken = getJwtToken(); // Retrieve JWT token from cookies
		const winResponse = await axios.get(`${URL}/user/win/${Id}`);
		const wins = winResponse.data.length; // Calculate wins from response data
		const lossResponse = await axios.get(`${URL}/user/loss/${Id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}, // Include JWT token in headers if available
		});
		const losses = lossResponse.data.length; // Calculate losses from response data
		const gamesPlayed = wins + losses; // Calculate total games played
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

// Function to fetch matches played by a player
/**
 * Fetches matches played by a given player ID.
 *
 * @param Id The ID of the player for whom matches are to be fetched.
 * @returns A promise that resolves to an array of matches played by the player.
 */
export const fetchPlayerMatches = async (
	Id: string
): Promise<MatchResponse[]> => {
	try {
		const jwtToken = getJwtToken(); // Retrieve JWT token from cookies
		const response = await axios.get(`${URL}/user/played/${Id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}, // Include JWT token in headers if available
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching player matches", error);
		throw error;
	}
};
