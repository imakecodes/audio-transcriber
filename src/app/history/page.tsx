"use client";

import HistoryList from "@/components/HistoryList";
import { motion } from "framer-motion";

export default function HistoryPage() {
    return (
        <main className="min-h-screen py-32 px-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none mix-blend-screen" />

            <div className="container mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Histórico de Transcrições</h1>
                    <p className="text-slate-400">Visualize e gerencie suas transcrições passadas</p>
                </motion.div>

                <HistoryList />
            </div>
        </main>
    );
}
