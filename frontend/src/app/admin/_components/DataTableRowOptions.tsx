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
import { DeleteUserModal } from "./DeleteUserModal";

/* eslint-disable */
export function DataTableRowActions<TData>({ row }: { row: TData }) {
	/* eslint-enable */
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
							setIsUpdateModalOpen(true);
						}}>
						Update User
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setIsDeleteModalOpen(true);
						}}>
						Delete User
					</DropdownMenuItem>
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
			{isDeleteModalOpen && (
				<DeleteUserModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					userData={userData}
				/>
			)}
		</>
	);
}
