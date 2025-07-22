import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import {Toaster} from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased flex items-center justify-between   h-screen w-full`}>
      {children}
      <img src={'/images/side-img.svg'} alt={'SideImg'} className={'hidden xl:block w-1/2 h-screen object-cover bg-no-repeat '} />
      <Toaster />
    </div>
  );
}
