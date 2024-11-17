"use client";

// Importing necessary React hooks and createContext for state management
import React, { createContext, useContext, useState, useEffect } from "react";
// Importing useUser hook from @clerk/nextjs for user management
import { useUser } from "@clerk/nextjs";

// Defining the interface for the UserContextProps
interface UserContextProps {
	user: any; // Represents the current user data
	setUser: React.Dispatch<React.SetStateAction<any>>; // Function to set the user data
}

// Creating the UserContext with an initial value of undefined
const UserContext = createContext<UserContextProps | undefined>(undefined);

// UserProvider component to wrap children and provide context
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// Using the useUser hook to get the current user
	const { user } = useUser();
	// Initializing the state for userData with a default value of null
	const [userData, setUserData] = useState<any>(null);

	// useEffect hook to update userData when the user state changes
	useEffect(() => {
		if (user) {
			setUserData(user);
		}
	}, [user]);

	// Providing the context value to children
	return (
		<UserContext.Provider value={{ user: userData, setUser: setUserData }}>
			{children}
		</UserContext.Provider>
	);
};

// Custom hook to use the UserContext
export const useUserContext = () => {
	// Using useContext to access the UserContext
	const context = useContext(UserContext);
	// Throwing an error if the context is not found, indicating it must be used within a UserProvider
	if (!context) {
		throw new Error("useUserContext must be used within a UserProvider");
	}
	return context;
};
