import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "Attendance Tracker",
    description:
        "Simple attendance monitoring system for PANDU Program participants. Enter matric number to check-in after each break.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.className} h-screen overflow-hidden`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AnimatedGridPattern />
                    <Navbar />
                    <main className="h-full w-full flex flex-col">
                        {children}
                    </main>
                </ThemeProvider>
                <Toaster richColors position="top-center" />
            </body>
        </html>
    );
}
