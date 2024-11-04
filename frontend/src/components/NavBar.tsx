"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton, SignedOut, SignedIn, SignInButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import ClientButton from "@/components/ClientButton";
import { useUser } from "@clerk/nextjs";
import { ModeToggle } from "./ThemeChangeButton";
import { useNavBarContext } from "@/context/navBarContext";

export default function Navbar() {
	const user = useUser();
	const isAdmin = user.user?.publicMetadata.role === "ADMIN";
	const isPlayer = user.user?.publicMetadata.role === "PLAYER";
	const [isOpen, setIsOpen] = useState(false);
	const { currentState, setState } = useNavBarContext();

	const toggleMenu = () => setIsOpen(!isOpen);

	const handleNavBarChange = (context: string) => {
		setState(context);
	};

	return (
		<nav className="bg-black text-white py-2 px-6">
			<div className="lg:container lg:mx-auto flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2">
					<div className="-mb-11 z-50">
						<Image
							src="/images/logo.png"
							alt="RacketRush Logo"
							width={120}
							height={100}
						/>
					</div>
				</Link>
				<div className="hidden lg:flex space-x-10">
					<Link
						href="/"
						className={`font-heading text-lg tracking-wider hover:text-red-400 transition-colors ${
							currentState === "home" ? "text-red-400" : ""
						}`}
						onClick={() => handleNavBarChange("home")}>
						HOME
					</Link>
					<Link
						href="/tournaments"
						className={`font-heading text-lg tracking-wider hover:text-red-400 transition-colors ${
							currentState === "tournaments" ? "text-red-400" : ""
						}`}
						onClick={() => handleNavBarChange("tournaments")}>
						TOURNAMENTS
					</Link>
					<Link
						href="/players"
						className={`font-heading text-lg tracking-wider hover:text-red-400 transition-colors ${
							currentState === "players" ? "text-red-400" : ""
						}`}
						onClick={() => handleNavBarChange("players")}>
						PLAYERS
					</Link>
					<Link
						href="/rankings"
						className={`font-heading text-lg tracking-wider hover:text-red-400 transition-colors ${
							currentState === "rankings" ? "text-red-400" : ""
						}`}
						onClick={() => handleNavBarChange("rankings")}>
						RANKINGS
					</Link>
					{/* <Link
						href="/predictions"
						className={`font-heading text-lg tracking-wider hover:text-red-400 transition-colors ${
							currentState === "matchPredict" ? "text-red-400" : ""
						}`}
						onClick={() => handleNavBarChange("matchPredict")}>
						MATCH PREDICTIONS
					</Link> */}
				</div>
				<div className="flex items-center space-x-4">
					{isAdmin && (
						<Link
							href={`/admin`}
							className={`font-heading hover:text-red-400 transition-colors ${
								currentState === "admin" ? "text-red-400" : ""
							}`}
							onClick={() => handleNavBarChange("admin")}>
							ADMIN
						</Link>
					)}
					{isPlayer && (
						<Link
							href={`/user-profile`}
							className={`font-heading hover:text-red-400 transition-colors ${
								currentState === "user-profile"
									? "text-red-400"
									: ""
							}`}
							onClick={() => handleNavBarChange("user-profile")}>
							PROFILE
						</Link>
					)}
					{/* <ModeToggle></ModeToggle> */}
					<SignedIn>
						<UserButton></UserButton>
					</SignedIn>
					<SignedOut>
						<ClientButton>
							<SignInButton mode="modal">
								<button className="font-heading text-lg tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
									JOIN NOW
								</button>
							</SignInButton>
						</ClientButton>
					</SignedOut>
					<span className="sr-only">User profile</span>
					<button
						onClick={toggleMenu}
						className="lg:hidden p-2 rounded-full hover:bg-gray-700 transition-colors">
						{isOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
						<span className="sr-only">Toggle menu</span>
					</button>
				</div>
			</div>
			{isOpen && (
				<div className="lg:hidden mt-16 mb-8 space-y-2">
					<Link
						href="/tournaments"
						className={`font-heading text-lg block py-2 px-4 hover:text-red-400 transition-colors ${
							currentState === "tournaments" ? "text-red-400" : ""
						}`}
						onClick={() => handleNavBarChange("tournaments")}>
						TOURNAMENT
					</Link>
					<Link
						href="/players"
						className={`font-heading text-lg block py-2 px-4 hover:text-red-400 transition-colors ${
							currentState === "players" ? "text-red-400" : ""
						}`}
						onClick={() => handleNavBarChange("players")}>
						PLAYERS
					</Link>
					<Link
						href="/rankings"
						className={`font-heading text-lg block py-2 px-4 hover:text-red-400 transition-colors ${
							currentState === "rankings" ? "text-red-400" : ""
						}`}
						onClick={() => handleNavBarChange("rankings")}>
						RANKINGS
					</Link>
					{/* <Link
						href="/predictions"
						className={`font-heading text-lg block py-2 px-4 hover:text-red-400 transition-colors ${
							currentState === "matchPredict" ? "text-red-400" : ""
						}`}
						onClick={() => handleNavBarChange("matchPredict")}>
						MATCH PREDICTIONS
					</Link> */}
				</div>
			)}
		</nav>
	);
}
