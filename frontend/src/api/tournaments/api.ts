import { Tournament } from "@/types/tournament";
import axios from "axios";

const URL = "http://localhost:8082";

type tournamentResponse = {
	id: number;
	tournamentName: string;
	startDT: string;
	endDT: string;
	status: string;
	regStartDT: string;
	regEndDT: string;
};

export const fetchTournaments = async (): Promise<tournamentResponse[]> => {
	try {
		// console.log(`${URL}/tournaments`);

		const response = await axios.get(`${URL}/tournaments`);
		const formattedData: tournamentResponse[] = response.data.map((tournament: any) => ({
			id: tournament.id,
			tournamentName: tournament.tournamentName,
			startDT: tournament.startDT,
			endDT: tournament.endDT,
			status: tournament.status,
			regStartDT: tournament.regStartDT,
			regEndDT: tournament.regEndDT
		}));
		
		return formattedData;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

export const getAllPlayersInTournament = async (tournament_id: number): Promise<any[]> => {
	try {
		console.log(`${URL}/tournaments/${tournament_id}/players`);

		const response = await axios.get(`${URL}/tournaments/${tournament_id}/players`);

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

export const checkPlayerRegisteredForTournament = async (tournament_id: number, user_id: string): Promise<boolean> => {
	try {
		// console.log(`${URL}/tournaments/${tournament_id}/players`);
		// console.log(user_id);
	
		const response = await axios.get(`${URL}/tournaments/${tournament_id}/players`);
	
		if (response.status === 200 && response.data) {
			// Check if the passed user_id exists in the array of player objects
			return response.data.some((player: { id: string }) => player.id === user_id);
		} else {
			return false; // Return false if no players are found or response is not OK
		}
	} catch (error) {
		console.error("Error fetching players in tournament", error);
		return false; // Return false in case of error
	}
};

export const registerTournament = async (tournament_id: number, user_id: string): Promise<boolean> => {
	try {
		// console.log(`${URL}/tournaments/${tournament_id}/players/${user_id}/register`);

		const response = await axios.post(`${URL}/tournaments/${tournament_id}/players/${user_id}/register`);
		console.log(response);
		return response.status === 200; 
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

export const withdrawTournament = async (tournament_id: number, user_id: string): Promise<boolean> => {
	try {
		console.log(`${URL}/tournaments/${tournament_id}/players/${user_id}/deregister`);

		const response = await axios.put(`${URL}/tournaments/${tournament_id}/players/${user_id}/deregister`);
		console.log(response);
		return response.status === 200; 
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};

export const createTournaments = async (tournamentData: Partial<Tournament>): Promise<boolean> => {
    try {
        // console.log(`${URL}/tournaments`);

        const response = await axios.post(`${URL}/tournaments`, tournamentData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.status === 201; 
    } catch (error) {
        console.error("Error creating tournaments", error);
        return false;
    }
};

export const updateTournaments = async (tournamentData: Partial<Tournament>): Promise<boolean> => {
	try {
		// console.log(`${URL}/tournaments/${tournamentData.id}`);

		const response = await axios.put(`${URL}/tournaments/${tournamentData.id}`, tournamentData, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		return response.status === 200; 
	} catch (error) {
		console.error("Error updating tournaments", error);
		return false;
	}
};

export const deleteTournament = async (tournament_id: number): Promise<boolean> => {
	try {
		// console.log(`${URL}/tournaments/${id}`);

		const response = await axios.delete(`${URL}/tournaments/${tournament_id}`);

		return response.status === 204; 
	} catch (error) {
		console.error("Error deleting tournaments", error);
		return false;
	}
};
