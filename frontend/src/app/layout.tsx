import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { ClientPageRoot } from "next/dist/client/components/client-page";
import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import localFont from "next/font/local";

const norwester = localFont({
  src: "./fonts/norwester.otf",
  variable: "--font-norwester"
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={norwester.variable}>
        <body>
          <header>
            <Navbar />
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>{children}</main>
          <footer>
            <Footer />
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}