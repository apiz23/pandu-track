"use client";

import React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Github,
    Linkedin,
    Music,
    Mail,
    Sparkles,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";

export function CMD() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            {/* Pure black theme */}
            <div className="bg-black text-gray-100">
                <CommandInput placeholder="Search creator profiles..." />

                <CommandList className="h-fit max-h-[90vh] overflow-y-auto bg-black">
                    <CommandEmpty className="text-center py-10">
                        <Sparkles className="h-10 w-10 text-purple-500 mb-2 mx-auto opacity-70" />
                        <p className="text-gray-300">No results found.</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Try searching for something else.
                        </p>
                    </CommandEmpty>
                    <div className="p-2">
                        <CommandGroup
                            heading="Creator Profiles"
                            className="text-gray-500"
                        >
                            <div className="text-xs text-gray-600 px-2 py-1.5">
                                Social media accounts
                            </div>

                            {/* GitHub */}
                            <CommandItem className="relative rounded-lg p-2 my-1 transition-all duration-150 data-[selected=true]:bg-gray-900 data-[selected=true]:text-white data-[selected=true]:ring-1 data-[selected=true]:ring-purple-500">
                                <Link
                                    href="https://github.com/apiz23"
                                    target="_blank"
                                    className="flex items-center gap-3 w-full"
                                    onClick={() => setOpen(false)}
                                >
                                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-900 group-hover:bg-gray-800 transition-colors">
                                        <Github className="h-5 w-5 text-gray-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="font-medium block truncate text-gray-100">
                                            GitHub
                                        </span>
                                        <p className="text-xs text-gray-500 truncate">
                                            @apiz23
                                        </p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-gray-600 ml-2 flex-shrink-0" />
                                </Link>
                            </CommandItem>

                            {/* LinkedIn */}
                            <CommandItem className="relative rounded-lg p-2 my-1 transition-all duration-150 data-[selected=true]:bg-gray-900 data-[selected=true]:text-white data-[selected=true]:ring-1 data-[selected=true]:ring-blue-500">
                                <Link
                                    href="https://www.linkedin.com/in/muh-hafizuddin"
                                    target="_blank"
                                    className="flex items-center gap-3 w-full"
                                    onClick={() => setOpen(false)}
                                >
                                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-900 group-hover:bg-gray-800 transition-colors">
                                        <Linkedin className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="font-medium block truncate text-gray-100">
                                            LinkedIn
                                        </span>
                                        <p className="text-xs text-gray-500 truncate">
                                            Muhammad Hafizuddin
                                        </p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-gray-600 ml-2 flex-shrink-0" />
                                </Link>
                            </CommandItem>

                            {/* TikTok */}
                            <CommandItem className="relative rounded-lg p-2 my-1 transition-all duration-150 data-[selected=true]:bg-gray-900 data-[selected=true]:text-white data-[selected=true]:ring-1 data-[selected=true]:ring-pink-500">
                                <Link
                                    href="https://www.tiktok.com/@hafizu_2"
                                    target="_blank"
                                    className="flex items-center gap-3 w-full"
                                    onClick={() => setOpen(false)}
                                >
                                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-900 group-hover:bg-gray-800 transition-colors">
                                        <Music className="h-5 w-5 text-pink-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="font-medium block truncate text-gray-100">
                                            TikTok
                                        </span>
                                        <p className="text-xs text-gray-500 truncate">
                                            @hafizu_2
                                        </p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-gray-600 ml-2 flex-shrink-0" />
                                </Link>
                            </CommandItem>
                        </CommandGroup>

                        <CommandSeparator className="my-3 bg-gray-800" />

                        {/* Contact */}
                        <CommandGroup
                            heading="Contact"
                            className="mt-4 text-gray-500"
                        >
                            <div className="text-xs text-gray-600 px-2 py-1.5">
                                Get in touch
                            </div>
                            <CommandItem className="relative rounded-lg p-2 my-1 transition-all duration-150 data-[selected=true]:bg-gray-900 data-[selected=true]:text-white data-[selected=true]:ring-1 data-[selected=true]:ring-green-500">
                                <Link
                                    href="mailto:piz230601@gmail.com"
                                    className="flex items-center gap-3 w-full"
                                    onClick={() => setOpen(false)}
                                >
                                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-900 group-hover:bg-gray-800 transition-colors">
                                        <Mail className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="font-medium block truncate text-gray-100">
                                            Send Email
                                        </span>
                                        <p className="text-xs text-gray-500 truncate">
                                            Get in touch
                                        </p>
                                    </div>
                                </Link>
                            </CommandItem>
                        </CommandGroup>
                    </div>
                </CommandList>
            </div>
        </CommandDialog>
    );
}