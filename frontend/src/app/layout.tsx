import {
  ClerkProvider,
} from "@clerk/nextjs";
import "./globals.css";
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