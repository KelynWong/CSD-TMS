export type Player = {
	id: string;
	username: string;
	fullname: string;
	gender: string;
	ranking: number;
	rating: number;
	wins: number;
	losses: number;
	total_matches: number;
	profilePicture: string;
	country: string;
	rank: number;
};

export type PlayerCardProps = {
	id: string;
	fullname: string;
	username: string;
	gender: string;
	profilePicture: string;
};
