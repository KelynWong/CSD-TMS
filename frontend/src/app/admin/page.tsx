"use client";

import React from "react";
import AdminHero from "@/components/AdminHero";
import { Admin } from "@/types/admin";
import { useState, useEffect } from "react";
import { formatDate } from "@/utils/dateFormatter";
import TournamentHistory from "@/components/TournamentHistory";
import { useUserContext } from "@/context/userContext";
import Loading from "@/components/Loading";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/DataTableColumns";
import { fetchUsers } from "@/api/users/api";
import { User } from "@/types/user";
import { useFetchUsersContext } from "@/context/fetchUsersContext";
import { useNavBarContext } from "@/context/navBarContext";

// This function is the main component for the admin page.
export default function AdminPage() {
	const { user } = useUserContext(); // Retrieve the user context.
	const [admin, setAdmin] = useState<Admin | null>(null); // State to hold admin data.
	const [users, setUsers] = useState<User[]>([]); // State to hold users data.
	const [loading, setLoading] = useState(true); // State to manage loading state.
	const { shouldFetchUsers, setShouldFetchUsers } = useFetchUsersContext(); // Context to manage fetching users.

	// Set the navbar context to 'admin' to update the navbar state.
	const { setState } = useNavBarContext();
	setState("admin");

	// Effect to fetch admin data and users when the user context is available.
	useEffect(() => {
		if (user) {
			setLoading(false); // Set loading to false when user data is available.

			const getAdminData = async () => {
				try {
					const mappedData: Admin = {
						id: user.id,
						username: user.username,
						fullname: user.fullName,
						profilePicture: user.imageUrl,
					};
					setAdmin(mappedData); // Set the admin state with mapped user data.

					const users = await fetchUsers(); // Fetch users data.
					setUsers(users); // Set the users state with fetched data.
				} catch (err) {
					console.error("Failed to fetch admin:", err); // Log error if fetching admin data fails.
				}
			};
			getAdminData();
		} else {
			setLoading(true); // Set loading to true if user data is not available.
		}
	}, [user]);

	// Effect to fetch users when the shouldFetchUsers context is true.
	useEffect(() => {
		if (shouldFetchUsers) {
			const getUsers = async () => {
				const users = await fetchUsers(); // Fetch users data.
				setUsers(users); // Set the users state with fetched data.
				setShouldFetchUsers(false); // Reset the shouldFetchUsers context.
			};
			getUsers();
		}
	}, [shouldFetchUsers, setShouldFetchUsers]);

	// Effect to handle users state changes.
	useEffect(() => {}, [users]);

	// If loading is true, render the Loading component.
	if (loading) {
		return <Loading />;
	}

	// Render the admin hero component if admin data is available, otherwise render Loading.
	return (
		<>
			<div>{admin ? <AdminHero admin={admin} /> : <Loading />}</div>
			<div className="container mx-auto py-5 px-5">
				<p className="text-4xl font-bold pb-3">Users</p>
				<DataTable columns={columns} data={users}></DataTable>
			</div>
		</>
	);
}
