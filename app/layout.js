import { Geist, Geist_Mono, Bangers } from "next/font/google";
import "./globals.css";
import StaggeredMenu from "@/components/StaggeredMenu";
import { ClerkProvider } from "@clerk/nextjs";

import LenisProvider from "@/components/LenisProvider";
import { Analytics } from "@vercel/analytics/next"
import PageTransition from "@/components/PageTransition";
import NavbarVisibilityWrapper from "@/components/NavbarVisibilityWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Avishkar 26",
  description: "The National Level Techno - Cultural Fest",
};

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "Events", ariaLabel: "View our events", link: "/events" },
  { label: "Autoshow", ariaLabel: "View our AutoShow", link: "/auto-show" },
  { label: "Proshow 1", ariaLabel: "View our Expo", link: "/pro-show/g-live" },
  {
    label: "Proshow 2",
    ariaLabel: "View our Expo",
    link: "/pro-show/zero-pause",
  },
  // { label: "About", ariaLabel: "Learn about us", link: "/about" },
  { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
  { label: "Registrations", ariaLabel: "View your registrations", link: "/events/my-registrations" },
];

const socialItems = [
  { label: "Instagram", link: "https://www.instagram.com/avishkar_.26" },
  { label: "Website", link: "https://musaliarcollege.com" },
];

export default function RootLayout({ children }) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable}`}
      >
        <body className="antialiased">
          <Analytics />
          {/* Menu overlay */}
          <NavbarVisibilityWrapper>
            <div className="fixed inset-0 z-20 h-[100dvh] pointer-events-none">
              <StaggeredMenu
                position="right"
                items={menuItems}
                socialItems={socialItems}
                displaySocials
                displayItemNumbering
                menuButtonColor="#fff"
                openMenuButtonColor="#000000"
                changeMenuColorOnOpen
                colors={["#FF7A7B", "#AD242C"]}
                logoUrl="/images/logo.PNG"
                accentColor="#AD242C"
              />
            </div>
          </NavbarVisibilityWrapper>

          {/* Auth button – aligned with menu */}
          {/* <NavbarVisibilityWrapper>
            <div className="fixed top-6 right-32 z-30 flex items-center pointer-events-auto text-white">
            </div>
          </NavbarVisibilityWrapper> */}
          <PageTransition>
            <LenisProvider>
              {children}
            </LenisProvider>
          </PageTransition>
        </body>
      </html>
    </ClerkProvider>
  );
}
