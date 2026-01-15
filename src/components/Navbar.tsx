"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, History as HistoryIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Início", href: "/", icon: Mic },
        { name: "Histórico", href: "/history", icon: HistoryIcon },
    ];

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex gap-1 shadow-lg shadow-black/20">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="navPill"
                                    className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon className="w-4 h-4 relative z-10" />
                            <span className="text-sm font-medium relative z-10">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
