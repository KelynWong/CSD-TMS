import axios from "axios";

const URL = process.env.NEXT_PUBLIC_USER_API_URL;

export type PlayerResponse = {
	id: string;
	username: string;
	fullname: string;
	gender: string;
	rating: number;
	country: string;
	profilePicture: string;
	email: string;
	role: string;
	rank: number;
};

export type AdminResponse = {
	id: string;
	username: string;
	fullname: string;
	profilePicture: string;
	email: string;
	role: string;
};

export type UserResponse = {
	id: string;
	username: string;
	fullname: string;
	email: string;
	role: string;
	gender: string;
	rating: number;
	country: string;
	profilePicture: string;
};

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

export const fetchUsers = async (): Promise<UserResponse[]> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		const formattedData: UserResponse[] = response.data.map((user: any) => ({
			id: user.id,
			username: user.username,
			fullname: user.fullname,
			email: user.email,
			role: user.role,
			gender: user.gender,
			rating:
				user.rating && user.rating.rating ? Math.floor(user.rating.rating) : 0,
			country: user.country,
			profilePicture: user.profilePicture,
		}));
		return formattedData;
	} catch (error) {
		console.error("Error fetching players", error);
		throw error;
	}
};

export const fetchOrganizer = async (id: string): Promise<string> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/${id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});
		
		return response.data.fullname;
	} catch (error) {
		console.error("Error fetching organizer", error);
		throw error;
	}
};

export const fetchUser = async (id: string): Promise<any> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/${id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		return response.data;
	} catch (error) {
		console.error("Error fetching organizer", error);
		throw error;
	}
};

export const fetchPlayer = async (id: string): Promise<PlayerResponse> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/${id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		const formattedData: PlayerResponse = {
			id: response.data.id,
			username: response.data.username,
			fullname: response.data.fullname,
			gender: response.data.gender,
			rating: Math.floor(response.data.rating.rating),
			country: response.data.country,
			profilePicture: response.data.profilePicture,
			email: response.data.email,
			role: response.data.role,
			rank: response.data.rank,
		};
		return formattedData;
	} catch (error) {
		console.error("Error fetching player", error);
		throw error;
	}
};

export const fetchUserByRoles = async (
	role: string
): Promise<PlayerResponse[] | AdminResponse[]> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/role/${role}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		if (role === "PLAYER") {
			return response.data.map((player: any) => ({
				id: player.id,
				username: player.username,
				fullname: player.fullname,
				gender: player.gender,
				rating: Math.floor(player.rating.rating),
				country: player.country,
				profilePicture: player.profilePicture,
				email: player.email,
				role: player.role,
				rank: player.rank,
			}));
		} else {
			return response.data.map((admin: any) => ({
				id: admin.id,
				username: admin.username,
				fullname: admin.fullname,
				profilePicture: admin.profilePicture,
				email: admin.email,
				role: admin.role,
			}));
		}
	} catch (error) {
		console.error("Error fetching players by role", error);
		throw error;
	}
};

// Fetch players ordered by rating
export const fetchTopPlayers = async (): Promise<PlayerResponse[]> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/top-players`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		const formattedData: PlayerResponse[] = response.data.map(
			(player: any) => ({
				id: player.id,
				username: player.username,
				fullname: player.fullname,
				gender: player.gender,
				rating: Math.floor(player.rating.rating),
				country: player.country,
				profilePicture: player.profilePicture,
				email: player.email,
				role: player.role,
				rank: player.rank,
			})
		);
		return formattedData;
	} catch (error) {
		console.error("Failed to fetch top players", error);
		throw error;
	}
};

export const getPlayerRank = async (id: string): Promise<number> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.get(`${URL}/${id}/rank`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		return response.data;
		// Assuming the API response contains a 'rank' field
	} catch (error) {
		console.error("Failed to fetch player rank", error);
		throw error;
	}
};

export const getAllPlayerDetails = async (ids: Array<string>): Promise<PlayerResponse> => {
	try {
		const jwtToken = getJwtToken();
		const response = await axios.post(`${URL}/ids`, ids, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		return response.data;
	} catch (error) {
		console.error("Failed to fetch tournament player details", error);
		throw error;
	}
};