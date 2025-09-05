"use client";

import Image from "next/image";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
    return (
        <header className="w-full sticky top-0 z-50 bg-transparent backdrop-blur-md border-b-2 border-neutral-700/10 dark:border-neutral-300/10">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
                {/* Website Title with Icon */}
                <div className="flex items-center gap-4">
                    <Image
                        src="/favicon-32x32.png" // pastikan ada file dalam public/
                        alt="PANDU Track Logo"
                        width={32}
                        height={32}
                        className="rounded-full outline-1"
                    />
                    <h1 className="text-2xl font-bold text-black dark:text-white">
                        PANDU Track
                    </h1>
                </div>

                {/* Theme Toggle */}
                <ModeToggle />
            </div>
        </header>
    );
}
