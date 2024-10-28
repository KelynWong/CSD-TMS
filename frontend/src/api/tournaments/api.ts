import { Tournament } from "@/types/tournament";
import axios from "axios";

const URL = process.env.NEXT_PUBLIC_TOURNAMENT_API_URL;

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

export const fetchTournaments = async (): Promise<tournamentResponse[]> => {
	try {
		const response = await axios.get(`${URL}`);
		const formattedData: tournamentResponse[] = response.data.map(
			(tournament: any) => ({
				id: tournament.id,
				tournamentName: tournament.tournamentName,
				startDT: tournament.startDT,
				endDT: tournament.endDT,
				status: tournament.status,
				regStartDT: tournament.regStartDT,
				regEndDT: tournament.regEndDT,
			})
		);

		return formattedData;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

export const fetchTournamentByPlayerId = async (
	player_id: string
): Promise<tournamentResponse[]> => {
	try {
		const response = await axios.get(`${URL}/players/${player_id}`);
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
		const response = await axios.get(`${URL}/id/${tournament_id}`);
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
		console.log(`${URL}/${tournament_id}/players`);

		const response = await axios.get(`${URL}/${tournament_id}/players`);

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
		const response = await axios.get(
			`${URL}/${tournament_id}/players/${user_id}`
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

export const registerTournament = async (
	tournament_id: number,
	user_id: string
): Promise<boolean> => {
	try {
		const response = await axios.post(
			`${URL}/${tournament_id}/players/${user_id}/register`
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
		console.log(`${URL}/${tournament_id}/players/${user_id}/deregister`);

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
		console.log(`${URL}`);
		console.log(tournamentData);

		const response = await axios.post(`${URL}`, tournamentData, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		console.log(response);

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
		const response = await axios.put(
			`${URL}/${tournamentData.id}`,
			tournamentData,
			{
				headers: {
					"Content-Type": "application/json",
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
		const response = await axios.put(
			`${URL}/${tournament_id}/status`,
			status,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

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
		const response = await axios.delete(`${URL}/${tournament_id}`);

		return response.status === 204;
	} catch (error) {
		console.error("Error deleting tournaments", error);
		return false;
	}
};
