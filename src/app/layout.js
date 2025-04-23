import "./globals.css";

export const metadata = {
  title: "Airdrop Tracker",
  description: "Track your crypto airdrops efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
