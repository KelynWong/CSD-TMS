"use client";

import React, { createContext, useContext, useState } from "react";

interface NavBarContextProps {
	currentState: string;
	setState: React.Dispatch<React.SetStateAction<string>>;
}

const NavBarContext = createContext<NavBarContextProps | undefined>(undefined);

export const NavBarProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [currentState, setState] = useState<string>("home");

	return (
		<NavBarContext.Provider value={{ currentState, setState }}>
			{children}
		</NavBarContext.Provider>
	);
};

export const useNavBarContext = () => {
	const context = useContext(NavBarContext);
	if (!context) {
		throw new Error(
			"useNavBarContext must be used within a NavBarProvider"
		);
	}
	return context;
};
