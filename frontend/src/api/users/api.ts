import axios from "axios";
import { Player } from "@/types/player";

export const fetchPlayers = async (): Promise<Player[]> => {
	try {
		const response = await axios.get("http://localhost:8080/api/users");
		return response.data;
	} catch (error) {
		console.error("Error fetching players", error);
		throw error;
	}
};
