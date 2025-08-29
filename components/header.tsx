"use client";

import { Calendar } from "lucide-react";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
            <div className="flex flex-col items-center justify-center space-y-3">
                {/* Logo with gradient border */}
                <div className="p-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                    <div className="bg-gray-900 p-2 rounded-full">
                        <Calendar className="h-8 w-8 text-white" />
                    </div>
                </div>

                {/* Event Name and Subtitle */}
                <div className="text-center space-y-1">
                    <div className="flex items-center justify-center">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-500 mr-2"></div>
                        <p className="text-sm text-gray-400 font-medium">
                            Attendance System
                        </p>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-500 ml-2"></div>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 bg-purple-600/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 translate-x-1/2 translate-y-1/2 bg-blue-600/20 rounded-full blur-xl"></div>
        </header>
    );
}
