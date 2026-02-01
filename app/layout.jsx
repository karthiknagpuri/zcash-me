import "./globals.css";
import Providers from "./providers";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Zcash.me",
  description: "Zcash.me directory and profiles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} style={{ colorScheme: 'only light' }}>
      <head>
        <meta name="color-scheme" content="only light" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="darkreader-lock" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
