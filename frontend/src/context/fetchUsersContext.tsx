"use client";

// Importing necessary React hooks and createContext for state management
import React, { createContext, useContext, useState } from "react";

// Defining the interface for the FetchUsersContextProps
interface FetchUsersContextProps {
	shouldFetchUsers: boolean; // Indicates if users should be fetched
	setShouldFetchUsers: React.Dispatch<React.SetStateAction<boolean>>; // Function to set shouldFetchUsers state
}

// Creating the FetchUsersContext with an initial value of undefined
const FetchUsersContext = createContext<FetchUsersContextProps | undefined>(
	undefined
);

// FetchUsersProvider component to wrap children and provide context
export const FetchUsersProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// Initializing the state for shouldFetchUsers with a default value of false
	const [shouldFetchUsers, setShouldFetchUsers] = useState(false);

	// Providing the context value to children
	return (
		<FetchUsersContext.Provider
			value={{ shouldFetchUsers, setShouldFetchUsers }}>
			{children}
		</FetchUsersContext.Provider>
	);
};

// Custom hook to use the FetchUsersContext
export const useFetchUsersContext = () => {
	// Using useContext to access the FetchUsersContext
	const context = useContext(FetchUsersContext);
	// Throwing an error if the context is not found, indicating it must be used within a FetchUsersProvider
	if (!context) {
		throw new Error(
			"useFetchUsersContext must be used within a FetchUsersProvider"
		);
	}
	return context;
};
