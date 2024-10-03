"use client";

import React, { createContext, useContext, useState } from "react";

interface FetchUsersContextProps {
	shouldFetchUsers: boolean;
	setShouldFetchUsers: React.Dispatch<React.SetStateAction<boolean>>;
}

const FetchUsersContext = createContext<FetchUsersContextProps | undefined>(
	undefined
);

export const FetchUsersProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [shouldFetchUsers, setShouldFetchUsers] = useState(false);

	return (
		<FetchUsersContext.Provider
			value={{ shouldFetchUsers, setShouldFetchUsers }}>
			{children}
		</FetchUsersContext.Provider>
	);
};

export const useFetchUsersContext = () => {
	const context = useContext(FetchUsersContext);
	if (!context) {
		throw new Error(
			"useFetchUsersContext must be used within a FetchUsersProvider"
		);
	}
	return context;
};
