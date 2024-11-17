import axios from "axios";

const URL = process.env.NEXT_PUBLIC_USER_API_URL;

// Player Response Type
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

// Admin Response Type
export type AdminResponse = {
	id: string;
	username: string;
	fullname: string;
	profilePicture: string;
	email: string;
	role: string;
};

// User Response Type
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



/**
 * Parses the document's cookies and returns an object with cookie names as keys and their values as values.
 * 
 * @returns An object where each key is a cookie name and its value is the corresponding cookie value.
 */
const getCookies = (): { [key: string]: string } => {
	const cookies: { [key: string]: string } = {};
	document.cookie.split(";").forEach((cookie) => {
		// Split each cookie into its name and value, trimming any whitespace
		const [name, value] = cookie.split("=").map((c) => c.trim());
		// Decode the value to handle any URL encoding
		cookies[name] = decodeURIComponent(value);
	});

	return cookies;
};

/**
 * Retrieves the JWT token from the document's cookies.
 * 
 * @returns The JWT token if found, otherwise null.
 */
export const getJwtToken = (): string | null => {
	const cookies = getCookies(); // Retrieve all cookies
	return cookies["__session"] || null; // Return the JWT token if found, otherwise null
};

/**
 * Fetches a list of users from the API and formats the response data.
 * 
 * @returns A promise that resolves to an array of UserResponse objects.
 */
export const fetchUsers = async (): Promise<UserResponse[]> => {
	try {
		// Retrieve the JWT token from cookies
		const jwtToken = getJwtToken();
		// Make a GET request to the API to fetch users
		const response = await axios.get(`${URL}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}, // Include JWT token in headers if available
		});

		// Format the response data into UserResponse objects
		const formattedData: UserResponse[] = response.data.map((user: any) => ({
			id: user.id,
			username: user.username,
			fullname: user.fullname,
			email: user.email,
			role: user.role,
			gender: user.gender,
			rating: user.rating && user.rating.rating ? Math.floor(user.rating.rating) : 0, // Ensure rating is a number and floor it
			country: user.country,
			profilePicture: user.profilePicture,
		}));
		return formattedData;
	} catch (error) {
		console.error("Error fetching players", error); // Log the error if fetching fails
		throw error; // Rethrow the error to be handled by the caller
	}
};

/**
 * Fetches the full name of an organizer by their ID.
 * 
 * @param id The ID of the organizer to fetch.
 * @returns A promise that resolves to the organizer's full name.
 */
export const fetchOrganizer = async (id: string): Promise<string> => {
	try {
		// Retrieve the JWT token from cookies
		const jwtToken = getJwtToken();
		// Make a GET request to the API to fetch the organizer's details
		const response = await axios.get(`${URL}/${id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}, // Include JWT token in headers if available
		});

		// Return the organizer's full name from the response data
		return response.data.fullname;
	} catch (error) {
		console.error("Error fetching organizer", error); // Log the error if fetching fails
		throw error; // Rethrow the error to be handled by the caller
	}
};

/**
 * Fetches a user by their ID.
 * 
 * This function makes a GET request to the API to fetch a user's details by their ID.
 * It includes the JWT token in the request headers if available.
 * 
 * @param id The ID of the user to fetch.
 * @returns A promise that resolves to the user's data.
 */
export const fetchUser = async (id: string): Promise<any> => {
	try {
		// Retrieve the JWT token from cookies
		const jwtToken = getJwtToken();
		// Make a GET request to the API to fetch the user's details
		const response = await axios.get(`${URL}/${id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}, // Include JWT token in headers if available
		});

		// Return the user's data from the response
		return response.data;
	} catch (error) {
		console.error("Error fetching user", error); // Log the error if fetching fails
		throw error; // Rethrow the error to be handled by the caller
	}
};

/**
 * Fetches a player's details by their ID.
 * 
 * This function makes a GET request to the API to fetch a player's details by their ID.
 * It includes the JWT token in the request headers if available.
 * 
 * @param id The ID of the player to fetch.
 * @returns A promise that resolves to the player's formatted data.
 */
export const fetchPlayer = async (id: string): Promise<PlayerResponse> => {
	try {
		// Retrieve the JWT token from cookies
		const jwtToken = getJwtToken();
		// Make a GET request to the API to fetch the player's details
		const response = await axios.get(`${URL}/${id}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}, // Include JWT token in headers if available
		});

		// Format the response data into the expected PlayerResponse structure
		const formattedData: PlayerResponse = {
			id: response.data.id,
			username: response.data.username,
			fullname: response.data.fullname,
			gender: response.data.gender,
			rating: Math.floor(response.data.rating.rating), // Convert rating to an integer
			country: response.data.country,
			profilePicture: response.data.profilePicture,
			email: response.data.email,
			role: response.data.role,
			rank: response.data.rank,
		};
		return formattedData;
	} catch (error) {
		console.error("Error fetching player", error); // Log the error if fetching fails
		throw error; // Rethrow the error to be handled by the caller
	}
};

/**
 * Fetches users by their role.
 * 
 * This function makes a GET request to the API to fetch users by their role.
 * It includes the JWT token in the request headers if available.
 * 
 * @param role The role of the users to fetch.
 * @returns A promise that resolves to an array of user data, either PlayerResponse or AdminResponse.
 */
export const fetchUserByRoles = async (
	role: string
): Promise<PlayerResponse[] | AdminResponse[]> => {
	try {
		const jwtToken = getJwtToken();
		// Make a GET request to the API to fetch users by their role
		const response = await axios.get(`${URL}/role/${role}`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		// Map the response data to the appropriate response structure based on the role
		if (role === "PLAYER") {
			return response.data.map((player: any) => ({
				id: player.id,
				username: player.username,
				fullname: player.fullname,
				gender: player.gender,
				rating: Math.floor(player.rating.rating), // Convert rating to an integer
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
		console.error("Error fetching players by role", error); // Log the error if fetching fails
		throw error; // Rethrow the error to be handled by the caller
	}
};

/**
 * Fetches the top players ordered by their rating.
 * 
 * This function makes a GET request to the API to fetch the top players ordered by their rating.
 * It includes the JWT token in the request headers if available.
 * 
 * @returns A promise that resolves to an array of PlayerResponse.
 */
export const fetchTopPlayers = async (): Promise<PlayerResponse[]> => {
	try {
		const jwtToken = getJwtToken();
		// Make a GET request to the API to fetch the top players
		const response = await axios.get(`${URL}/top-players`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		// Format the response data into the expected PlayerResponse structure
		const formattedData: PlayerResponse[] = response.data.map(
			(player: any) => ({
				id: player.id,
				username: player.username,
				fullname: player.fullname,
				gender: player.gender,
				rating: Math.floor(player.rating.rating), // Convert rating to an integer
				country: player.country,
				profilePicture: player.profilePicture,
				email: player.email,
				role: player.role,
				rank: player.rank,
			})
		);
		return formattedData;
	} catch (error) {
		console.error("Failed to fetch top players", error); // Log the error if fetching fails
		throw error; // Rethrow the error to be handled by the caller
	}
};

/**
 * Fetches a player's rank by their ID.
 * 
 * This function makes a GET request to the API to fetch a player's rank by their ID.
 * It includes the JWT token in the request headers if available.
 * 
 * @param id The ID of the player to fetch their rank.
 * @returns A promise that resolves to the player's rank.
 */
export const getPlayerRank = async (id: string): Promise<number> => {
	try {
		const jwtToken = getJwtToken();
		// Make a GET request to the API to fetch the player's rank
		const response = await axios.get(`${URL}/${id}/rank`, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		return response.data; // Assuming the API response contains a 'rank' field
	} catch (error) {
		console.error("Failed to fetch player rank", error); // Log the error if fetching fails
		throw error; // Rethrow the error to be handled by the caller
	}
};

/**
 * Fetches all player details by their IDs.
 * 
 * This function makes a POST request to the API to fetch all player details by their IDs.
 * It includes the JWT token in the request headers if available.
 * 
 * @param ids An array of player IDs to fetch their details.
 * @returns A promise that resolves to the player's details.
 */
export const getAllPlayerDetails = async (
	ids: Array<string>
): Promise<PlayerResponse> => {
	try {
		const jwtToken = getJwtToken();
		// Make a POST request to the API to fetch all player details
		const response = await axios.post(`${URL}/ids`, ids, {
			headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
		});

		return response.data;
	} catch (error) {
		console.error("Failed to fetch tournament player details", error); // Log the error if fetching fails
		throw error; // Rethrow the error to be handled by the caller
	}
};
