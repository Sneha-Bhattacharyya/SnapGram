import {Geist, Geist_Mono} from "next/font/google";
import "../globals.css";
import TopBar from "@/components/shared/TopBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/Bottombar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className={`w-full md:flex h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}>
          <TopBar/>
          <LeftSidebar/>

          <section className="flex flex-1 h-full">
              {children}
          </section>

          <Bottombar/>
      </div>
  );
}