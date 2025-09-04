import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";
import { CMD } from "@/components/cmd";

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
                className={`${poppins.className} relative h-screen md:overflow-hidden`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AnimatedGridPattern
                        numSquares={60}
                        maxOpacity={0.4}
                        duration={4}
                        color="#f59e0b"
                        randomMove={true}
                        randomDuration={true}
                        width={30}
                        height={30}
                        className={cn(
                            "[mask-image:radial-gradient(ellipse_80%_100%_at_bottom,white,transparent)]",
                            "sm:[mask-image:radial-gradient(ellipse_80%_100%_at_bottom,white,transparent)]",
                            "md:[mask-image:radial-gradient(ellipse_90%_100%_at_bottom,white,transparent)]",
                            "lg:[mask-image:radial-gradient(ellipse_100%_100%_at_bottom,white,transparent)]"
                        )}
                    />

                    {/* Foreground content */}
                    <CMD />
                    <div className="relative z-10 flex flex-col h-full">
                        <Navbar />
                        <main className="flex-1 flex md:items-center justify-center px-6 md:px-0 md:py-0 py-14">
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
                <Toaster richColors expand={true} />
            </body>
        </html>
    );
}
