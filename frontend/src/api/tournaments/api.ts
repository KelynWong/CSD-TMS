import { Tournament } from "@/types/tournament";
import axios from "axios";

const URL = process.env.NEXT_PUBLIC_TOURNAMENT_API_URL;
// const URL = '/api/tournaments';

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

export const fetchTournaments = async (): Promise<Tournament[]> => {
	try {
		const jwtToken = getJwtToken(); 
		console.log("jwtToken: ", jwtToken);
		console.log("URL: ", URL);
		const response = await axios.get(`${URL}`, 
			{
				headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
			}
		);
		console.log("fetchTournaments API Response:", response); 
		console.log("fetchTournaments API Response data:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

export const fetchTournamentByPlayerId = async (
	player_id: string
): Promise<tournamentResponse[]> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.get(`${URL}/players/${player_id}`, {
			// headers: {
			// 	Authorization: `Bearer ${jwtToken}`,
			// },
		});
		console.log(response.data);
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

export const fetchTournamentById = async (
	tournament_id: number
): Promise<Tournament> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.get(`${URL}/id/${tournament_id}`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error(`Error fetching tournament ${tournament_id}`, error);
		throw error;
	}
};

export const fetchAllPlayersByTournament = async (
	tournament_id: number
): Promise<any[]> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.get(`${URL}/${tournament_id}/players`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
			
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

export const fetchPlayerRegistrationStatus = async (
	tournament_id: number,
	user_id: string
): Promise<boolean> => {
	
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.get(
			`${URL}/${tournament_id}/players/${user_id}`,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				
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

export const fetchTournamentsByStatus = async (status: String): Promise<Tournament[]> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.get(`${URL}/status/${status}`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
			
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

export const registerTournament = async (
	tournament_id: number,
	user_id: string
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.post(
			`${URL}/${tournament_id}/players/${user_id}/register`,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				
			}
		);
		console.log(response);
		return response.status === 200;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

export const withdrawTournament = async (
	tournament_id: number,
	user_id: string
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken(); 
		console.log(`${URL}/${tournament_id}/players/${user_id}/deregister`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
			
		});

		const response = await axios.put(
			`${URL}/${tournament_id}/players/${user_id}/deregister`
		);
		console.log(response);
		return response.status === 200;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

export const createTournaments = async (
	tournamentData: Partial<Tournament>
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.post(`${URL}`, tournamentData, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwtToken}`,
			},
			
		});
		return response.status === 201;
	} catch (error) {
		console.error("Error creating tournaments", error);
		return false;
	}
};

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
					Authorization: `Bearer ${jwtToken}`,
				},
				
			}
		);

		return response.status === 200;
	} catch (error) {
		console.error("Error updating tournaments", error);
		return false;
	}
};

export const updateTournamentStatusById = async (
	tournament_id: number,
	status: String
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.put(`${URL}/${tournament_id}/status`, status, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwtToken}`,
			},
			
		});

		return response.status === 200;
	} catch (error) {
		console.error("Error updating tournament status", error);
		return false;
	}
};

export const deleteTournament = async (
	tournament_id: number
): Promise<boolean> => {
	try {
		const jwtToken = getJwtToken(); 
		const response = await axios.delete(`${URL}/${tournament_id}`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
			
		});
		return response.status === 204;
	} catch (error) {
		console.error("Error deleting tournaments", error);
		return false;
	}
};
