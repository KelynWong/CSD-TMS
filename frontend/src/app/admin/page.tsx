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

export default function AdminPage() {
	const { user } = useUserContext();
	const [admin, setAdmin] = useState<Admin | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const { shouldFetchUsers, setShouldFetchUsers } = useFetchUsersContext();

	// Set navbar context
	const { setState } = useNavBarContext();
	setState("admin");

	useEffect(() => {
		if (user) {
			// Fetch admin data only when user data is available
			setLoading(false);

			const getAdminData = async () => {
				try {
					const mappedData: Admin = {
						id: user.id,
						username: user.username,
						fullname: user.fullName,
						profilePicture: user.imageUrl,
					};
					setAdmin(mappedData);

					const users = await fetchUsers();
					setUsers(users);
				} catch (err) {
					console.error("Failed to fetch admin:", err);
				}
			};
			getAdminData();
		} else {
			setLoading(true);
		}
	}, [user]);

	useEffect(() => {
		if (shouldFetchUsers) {
			const getUsers = async () => {
				const users = await fetchUsers();
				setUsers(users);
				setShouldFetchUsers(false);
			};
			getUsers();
		}
	}, [shouldFetchUsers, setShouldFetchUsers]);

	useEffect(() => {}, [users]);

	if (loading) {
		return <Loading />;
	}

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
