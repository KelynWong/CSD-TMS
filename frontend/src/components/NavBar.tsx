'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { User, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold">R</span>
          </div>
          <span className="text-xl font-bold">RACKETRUSH</span>
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/tournament" className="hover:text-blue-400 transition-colors">TOURNAMENT</Link>
          <Link href="/players" className="hover:text-blue-400 transition-colors">PLAYERS</Link>
          <Link href="/rankings" className="hover:text-blue-400 transition-colors">RANKINGS</Link>
          <Link href="/predictions" className="hover:text-blue-400 transition-colors">MATCH PREDICTIONS</Link>
        </div>
        <div className="flex items-center space-x-4">
            <UserButton></UserButton>
            <span className="sr-only">User profile</span>
          <button onClick={toggleMenu} className="md:hidden p-2 rounded-full hover:bg-gray-700 transition-colors">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <Link href="/tournament" className="block py-2 px-4 hover:bg-gray-700 transition-colors">TOURNAMENT</Link>
          <Link href="/players" className="block py-2 px-4 hover:bg-gray-700 transition-colors">PLAYERS</Link>
          <Link href="/rankings" className="block py-2 px-4 hover:bg-gray-700 transition-colors">RANKINGS</Link>
          <Link href="/predictions" className="block py-2 px-4 hover:bg-gray-700 transition-colors">MATCH PREDICTIONS</Link>
        </div>
      )}
    </nav>
  )
}