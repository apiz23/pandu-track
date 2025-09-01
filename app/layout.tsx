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
    title: "PANDU Tracker",
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
            <body
                className={`${poppins.className} relative h-screen overflow-hidden`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* Background grid */}
                    <AnimatedGridPattern className="absolute inset-0 w-full -z-10" />

                    {/* Foreground content */}
                    <div className="relative z-10 flex flex-col h-full">
                        <Navbar />
                        <main className="flex-1 flex items-center justify-center">
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
                <Toaster richColors expand={true} />
            </body>
        </html>
    );
}
