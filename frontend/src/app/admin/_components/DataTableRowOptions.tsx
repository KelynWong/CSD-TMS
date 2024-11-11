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
import Link from "next/link";

/* eslint-disable */
export function DataTableRowActions<TData>({ row }: { row: TData }) {
	/* eslint-enable */
	const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 data-[state=open]:bg-muted text-primary">
						<DotsHorizontalIcon className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					<Link href={`/players/${row.id}`} passHref prefetch={true}>
						<DropdownMenuItem>View User Profile</DropdownMenuItem>
					</Link>
					<DropdownMenuItem
						onClick={() => {
							setIsUpdateModalOpen(true);
						}}>
						Update User Profile
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setIsDeleteModalOpen(true);
						}}>
						Delete User Profile
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{isUpdateModalOpen && (
				<UpdateUserModal
					isOpen={isUpdateModalOpen}
					onClose={() => setIsUpdateModalOpen(false)}
					userData={row}
				/>
			)}
			{isDeleteModalOpen && (
				<DeleteUserModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					userData={row}
				/>
			)}
		</>
	);
}
