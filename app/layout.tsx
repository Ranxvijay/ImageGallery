import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Falcon Inn Concierge | Lundy's Lane, Niagara Falls",
  description:
    "Chat with our AI concierge to learn about Falcon Inn on Lundy's Lane, Niagara Falls. Ask about rooms, amenities, check-in times, and book directly for the best rates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
