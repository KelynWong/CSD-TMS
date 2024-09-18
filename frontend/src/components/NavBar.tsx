'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserButton, SignedOut, SignedIn, SignInButton } from '@clerk/nextjs'
import { User, Menu, X } from 'lucide-react'
import Image from 'next/image'
import ClientButton from "@/components/ClientButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-black text-white py-2 px-6">
      <div className="lg:container lg:mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="-mb-11">
            <Image src="/images/logo.png" alt="RacketRush Logo" width={120} height={100} />
          </div>
        </Link>
        <div className="hidden lg:flex space-x-10">
          <Link href="/" className="text-lg tracking-wider hover:text-red-400 transition-colors">HOME</Link>
          <Link href="/tournament" className="text-lg tracking-wider hover:text-red-400 transition-colors">TOURNAMENT</Link>
          <Link href="/players" className="text-lg tracking-wider hover:text-red-400 transition-colors">PLAYERS</Link>
          <Link href="/rankings" className="text-lg tracking-wider hover:text-red-400 transition-colors">RANKINGS</Link>
          <Link href="/predictions" className="text-lg tracking-wider hover:text-red-400 transition-colors">MATCH PREDICTIONS</Link>
        </div>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <UserButton></UserButton>
          </SignedIn>
          <SignedOut>
            <ClientButton>
              <SignInButton mode="modal">
                <button className="text-lg tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                  JOIN NOW
                </button>
              </SignInButton>
            </ClientButton>
          </SignedOut>
            <span className="sr-only">User profile</span>
          <button onClick={toggleMenu} className="lg:hidden p-2 rounded-full hover:bg-gray-700 transition-colors">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden mt-4 space-y-2">
          <Link href="/tournament" className="block py-2 px-4 hover:bg-gray-700 transition-colors">TOURNAMENT</Link>
          <Link href="/players" className="block py-2 px-4 hover:bg-gray-700 transition-colors">PLAYERS</Link>
          <Link href="/rankings" className="block py-2 px-4 hover:bg-gray-700 transition-colors">RANKINGS</Link>
          <Link href="/predictions" className="block py-2 px-4 hover:bg-gray-700 transition-colors">MATCH PREDICTIONS</Link>
        </div>
      )}
    </nav>
  )
}