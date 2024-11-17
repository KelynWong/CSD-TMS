"use client";

// Importing necessary React hooks and createContext for state management
import React, { createContext, useContext, useState } from "react";

// Defining the interface for the NavBarContextProps
interface NavBarContextProps {
	currentState: string; // Represents the current state of the navigation bar
	setState: React.Dispatch<React.SetStateAction<string>>; // Function to set the currentState
}

// Creating the NavBarContext with an initial value of undefined
const NavBarContext = createContext<NavBarContextProps | undefined>(undefined);

// NavBarProvider component to wrap children and provide context
export const NavBarProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// Initializing the state for currentState with a default value of "home"
	const [currentState, setState] = useState<string>("home");

	// Providing the context value to children
	return (
		<NavBarContext.Provider value={{ currentState, setState }}>
			{children}
		</NavBarContext.Provider>
	);
};

// Custom hook to use the NavBarContext
export const useNavBarContext = () => {
	// Using useContext to access the NavBarContext
	const context = useContext(NavBarContext);
	// Throwing an error if the context is not found, indicating it must be used within a NavBarProvider
	if (!context) {
		throw new Error(
			"useNavBarContext must be used within a NavBarProvider"
		);
	}
	return context;
};
