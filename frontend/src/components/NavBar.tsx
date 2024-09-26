'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserButton, SignedOut, SignedIn, SignInButton } from '@clerk/nextjs'
import { User, Menu, X } from 'lucide-react'
import Image from 'next/image'
import ClientButton from "@/components/ClientButton";
import { ModeToggle } from './ThemeChangeButton'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
		<nav className="bg-black text-white p-4">
			<div className="container mx-auto flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2">
					<div className="w-12 h-12">
						<Image
							src="/images/logo.png"
							alt="RacketRush Logo"
							width={60}
							height={60}
						/>
					</div>
				</Link>
				<div className="hidden md:flex space-x-6">
					<Link href="/" className="hover:text-red-400 transition-colors">
						HOME
					</Link>
					<Link
						href="/tournament"
						className="hover:text-red-400 transition-colors">
						TOURNAMENT
					</Link>
					<Link
						href="/players"
						className="hover:text-red-400 transition-colors">
						PLAYERS
					</Link>
					<Link
						href="/rankings"
						className="hover:text-red-400 transition-colors">
						RANKINGS
					</Link>
					<Link
						href="/predictions"
						className="hover:text-red-400 transition-colors">
						MATCH PREDICTIONS
					</Link>
				</div>
				<div className="flex items-center space-x-4">
          <ModeToggle></ModeToggle>
					<SignedIn>
						<UserButton></UserButton>
					</SignedIn>
					<SignedOut>
						<ClientButton>
							<SignInButton mode="modal">
								<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
									JOIN NOW
								</button>
							</SignInButton>
						</ClientButton>
					</SignedOut>
					<span className="sr-only">User profile</span>
					<button
						onClick={toggleMenu}
						className="md:hidden p-2 rounded-full hover:bg-gray-700 transition-colors">
						{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						<span className="sr-only">Toggle menu</span>
					</button>
				</div>
			</div>
			{isOpen && (
				<div className="md:hidden mt-4 space-y-2">
					<Link
						href="/tournament"
						className="block py-2 px-4 hover:bg-gray-700 transition-colors">
						TOURNAMENT
					</Link>
					<Link
						href="/players"
						className="block py-2 px-4 hover:bg-gray-700 transition-colors">
						PLAYERS
					</Link>
					<Link
						href="/rankings"
						className="block py-2 px-4 hover:bg-gray-700 transition-colors">
						RANKINGS
					</Link>
					<Link
						href="/predictions"
						className="block py-2 px-4 hover:bg-gray-700 transition-colors">
						MATCH PREDICTIONS
					</Link>
				</div>
			)}
		</nav>
	);
}