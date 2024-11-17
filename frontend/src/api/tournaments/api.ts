import { Tournament } from "@/types/tournament";
import axios from "axios";

// API base URL for tournament endpoints
const URL = process.env.NEXT_PUBLIC_TOURNAMENT_API_URL;

// Interface defining the structure of tournament response data
export interface tournamentResponse {
	id: number;
	tournamentName: string;
	startDT: string;
	endDT: string;
	status: string;
	regStartDT: string;
	regEndDT: string;
	winner: string;
}

/**
 * Parses document cookies into a key-value object
 * @returns Object containing cookie name-value pairs
 */
const getCookies = (): { [key: string]: string } => {
	const cookies: { [key: string]: string } = {};
	document.cookie.split(";").forEach((cookie) => {
		const [name, value] = cookie.split("=").map((c) => c.trim());
		cookies[name] = decodeURIComponent(value);
	});

	return cookies;
};

/**
 * Retrieves JWT token from cookies
 * @returns JWT token string if found, null otherwise
 */
export const getJwtToken = (): string | null => {
	const cookies = getCookies();
	return cookies["__session"] || null;
};

/**
 * Fetches all tournaments
 * @returns Promise resolving to array of Tournament objects
 */
export const fetchTournaments = async (): Promise<Tournament[]> => {
	try {
		const jwtToken = getJwtToken();
		console.log("jwtToken: ", jwtToken);
		const response = await axios.get(`${URL}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

/**
 * Fetches tournaments for a specific player
 * @param player_id ID of the player
 * @returns Promise resolving to array of tournament responses
 */
export const fetchTournamentByPlayerId = async (
	player_id: string
): Promise<tournamentResponse[]> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/players/${player_id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		const formattedData: tournamentResponse[] = response.data.map(
			(tournament: tournamentResponse) => ({
				id: tournament.id,
				tournamentName: tournament.tournamentName,
				startDT: tournament.startDT,
				endDT: tournament.endDT,
				status: tournament.status,
				regStartDT: tournament.regStartDT,
				regEndDT: tournament.regEndDT,
				winner: tournament.winner,
			})
		);
		return formattedData;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			console.warn(`No tournaments found for player ID: ${player_id}`);
			return [];
		} else {
			console.error("Error fetching tournaments by player ID", error);
			throw error;
		}
	}
};

/**
 * Fetches a specific tournament by ID
 * @param tournament_id ID of the tournament
 * @returns Promise resolving to Tournament object
 */
export const fetchTournamentById = async (
	tournament_id: number
): Promise<Tournament> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/id/${tournament_id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});
		return response.data;
	} catch (error) {
		console.error(`Error fetching tournament ${tournament_id}`, error);
		throw error;
	}
};

/**
 * Fetches all players registered in a tournament
 * @param tournament_id ID of the tournament
 * @returns Promise resolving to array of player objects
 */
export const fetchAllPlayersByTournament = async (
	tournament_id: number
): Promise<any[]> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/${tournament_id}/players`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		// Check if the response has data and return the array of players
		if (response.status === 200 && response.data) {
			return response.data;
		} else {
			return [];
		}
	} catch (error) {
		console.error("Error fetching players in tournament", error);
		return [];
	}
};

/**
 * Checks if a player is registered for a tournament
 * @param tournament_id ID of the tournament
 * @param user_id ID of the user/player
 * @returns Promise resolving to boolean indicating registration status
 */
export const fetchPlayerRegistrationStatus = async (
	tournament_id: number,
	user_id: string
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(
			`${URL}/${tournament_id}/players/${user_id}`,
			{
				headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
			}
		);
		// Return true if the user is found and registered
		return response.data.IsRegistered;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			// If player is not found, simply return false
			return false;
		}
		// Log unexpected errors only
		console.error(
			"Unexpected error fetching player registration status",
			error
		);
		return false;
	}
};

/**
 * Fetches tournaments by their status
 * @param status Status to filter tournaments by
 * @returns Promise resolving to array of Tournament objects
 */
export const fetchTournamentsByStatus = async (
	status: String
): Promise<Tournament[]> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/status/${status}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

/**
 * Registers a player for a tournament
 * @param tournament_id ID of the tournament
 * @param user_id ID of the user to register
 * @returns Promise resolving to boolean indicating success
 */
export const registerTournament = async (
	tournament_id: number,
	user_id: string
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.post(
			`${URL}/${tournament_id}/players/${user_id}/register`,
			{},
			{
				headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
			}
		);

		return response.status === 200;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

/**
 * Withdraws a player from a tournament
 * @param tournament_id ID of the tournament
 * @param user_id ID of the user to withdraw
 * @returns Promise resolving to boolean indicating success
 */
export const withdrawTournament = async (
	tournament_id: number,
	user_id: string
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.put(
			`${URL}/${tournament_id}/players/${user_id}/deregister`,
			{},
			{
				headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
			}
		);

		return response.status === 200;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

/**
 * Creates a new tournament
 * @param tournamentData Tournament data to create
 * @returns Promise resolving to boolean indicating success
 */
export const createTournaments = async (
	tournamentData: Partial<Tournament>
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.post(`${URL}`, tournamentData, {
			headers: {
				"Content-Type": "application/json",
				...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
			},
		});
		return response.status === 201;
	} catch (error) {
		console.error("Error creating tournaments", error);
		return false;
	}
};

/**
 * Updates an existing tournament
 * @param tournamentData Updated tournament data
 * @returns Promise resolving to boolean indicating success
 */
export const updateTournaments = async (
	tournamentData: Partial<Tournament>
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.put(
			`${URL}/${tournamentData.id}`,
			tournamentData,
			{
				headers: {
					"Content-Type": "application/json",
					...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
				},
			}
		);

		return response.status === 200;
	} catch (error) {
		console.error("Error updating tournaments", error);
		return false;
	}
};

/**
 * Updates the status of a tournament
 * @param tournament_id ID of the tournament
 * @param status New status to set
 * @returns Promise resolving to boolean indicating success
 */
export const updateTournamentStatusById = async (
	tournament_id: number,
	status: String
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.put(`${URL}/${tournament_id}/status`, status, {
			headers: {
				"Content-Type": "application/json",
				...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
			},
		});

		return response.status === 200;
	} catch (error) {
		console.error("Error updating tournament status", error);
		return false;
	}
};

/**
 * Deletes a tournament
 * @param tournament_id ID of the tournament to delete
 * @returns Promise resolving to boolean indicating success
 */
export const deleteTournament = async (
	tournament_id: number
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.delete(`${URL}/${tournament_id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});
		return response.status === 204;
	} catch (error) {
		console.error("Error deleting tournaments", error);
		return false;
	}
};
