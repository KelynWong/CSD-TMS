"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { UpdateUserModal } from "./UpdateUserModal";
import { on } from "events";

/* eslint-disable */
export function DataTableRowActions<TData>({ row }: { row: TData }) {
	/* eslint-enable */
	console.log(row);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
	const [userData, setUserData] = React.useState(row);
	const handleSave = (updatedUser: TData) => {
		setUserData(updatedUser);
	};
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 data-[state=open]:bg-muted text-primary">
						<DotsHorizontalIcon className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					<DropdownMenuItem
						onClick={() => {
							console.log("Update User");
							setIsUpdateModalOpen(true);
						}}>
						Update User
					</DropdownMenuItem>
					<DropdownMenuItem>Delete User</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{isUpdateModalOpen && (
				<UpdateUserModal
					isOpen={isUpdateModalOpen}
					onClose={() => setIsUpdateModalOpen(false)}
					userData={userData}
					onSave={handleSave}
				/>
			)}
		</>
	);
}
