export default function Footer() {
  return (
    <footer className="bg-black text-primary-foreground py-4 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium uppercase">
          © {new Date().getFullYear()} RACKETRUSH, ALL RIGHT RESERVED.
        </p>
      </div>
    </footer>
  )
}