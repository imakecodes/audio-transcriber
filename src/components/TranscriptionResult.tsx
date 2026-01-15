"use client";

import { Copy, Check, Quote, FileText, Sparkles, AlignLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';

interface TranscriptionResultProps {
    text: string;
    formattedText?: string | null;
    isLoading: boolean;
    error?: string | null;
}

export default function TranscriptionResult({
    text,
    formattedText,
    isLoading,
    error,
}: TranscriptionResultProps) {
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState<"original" | "formatted">("formatted");

    const effectiveText = viewMode === "formatted" && formattedText ? formattedText : text;

    const handleCopy = () => {
        navigator.clipboard.writeText(effectiveText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // If no formatted text available, force original
    if (!formattedText && viewMode === "formatted" && text) {
        setViewMode("original");
    }

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-2xl mx-auto mt-8 bg-slate-900/40 backdrop-blur-md rounded-3xl p-12 border border-white/5 flex flex-col items-center justify-center min-h-[300px]"
                >
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                        </div>
                    </div>
                    <p className="mt-6 text-slate-300 font-medium animate-pulse">
                        Processando Áudio...
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                        Primeiro transcrevendo diretamente, depois polindo com IA...
                    </p>
                </motion.div>
            ) : error ? (
                <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl mx-auto mt-8 bg-red-500/10 backdrop-blur-md rounded-2xl p-6 border border-red-500/20 text-center"
                >
                    <p className="text-red-400 font-medium">{error}</p>
                </motion.div>
            ) : text ? (
                <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-3xl mx-auto mt-8 relative"
                >
                    {/* View Toggle */}
                    {formattedText && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center bg-slate-900/50 p-1 rounded-full border border-white/10 backdrop-blur-md z-10">
                            <button
                                onClick={() => setViewMode("original")}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${viewMode === "original"
                                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <AlignLeft className="w-4 h-4" />
                                Original
                            </button>
                            <button
                                onClick={() => setViewMode("formatted")}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${viewMode === "formatted"
                                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Sparkles className="w-4 h-4" />
                                Formatado
                            </button>
                        </div>
                    )}

                    <div className="glass rounded-3xl overflow-hidden mt-4">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10">
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="font-medium text-slate-200">
                                    {viewMode === "formatted" ? "Transcrição Melhorada por IA" : "Transcrição Bruta"}
                                </h3>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all text-sm font-medium border border-transparent hover:border-white/10"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copiado" : "Copiar Texto"}
                            </button>
                        </div>

                        <div className="p-8 bg-slate-900/30 min-h-[200px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={viewMode}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative"
                                >
                                    <Quote className="absolute -top-4 -left-4 w-8 h-8 text-indigo-500/20" />
                                    <div className="text-slate-300 leading-loose font-light text-lg pl-2 prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 max-w-none">
                                        {viewMode === "formatted" ? (
                                            <ReactMarkdown>{formattedText || ""}</ReactMarkdown>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{text}</p>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
