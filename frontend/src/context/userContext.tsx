"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface UserContextProps {
	user: any;
	setUser: React.Dispatch<React.SetStateAction<any>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { user } = useUser();
	const [userData, setUserData] = useState<any>(null);

	useEffect(() => {
		if (user) {
			setUserData(user);
		}
	}, [user]);
	console.log(user);
	return (
		<UserContext.Provider value={{ user: userData, setUser: setUserData }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUserContext must be used within a UserProvider");
	}
	return context;
};
