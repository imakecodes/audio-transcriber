"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, FileAudio, Search, ChevronLeft, ChevronRight, Loader2, Sparkles, AlignLeft, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import ConfirmationModal from "@/components/ConfirmationModal";

interface TranscriptionRecord {
    id: string;
    filename: string;
    originalName: string;
    name?: string;
    description?: string;
    text: string;
    formattedText?: string;
    createdAt: string;
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function HistoryList() {
    const [history, setHistory] = useState<TranscriptionRecord[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [itemToDelete, setItemToDelete] = useState<TranscriptionRecord | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                q: debouncedSearch,
                page: page.toString(),
                limit: "5" // 5 items per page
            });
            const res = await fetch(`/api/history?${params.toString()}`);
            const data = await res.json();
            if (data.data) {
                setHistory(data.data);
                setMeta(data.meta);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, page]);

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/history/${itemToDelete.id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                // Refresh list
                fetchHistory();
                setItemToDelete(null);
            } else {
                console.error("Failed to delete");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto mt-8"
        >
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-gradient">Histórico</h2>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar transcrições..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-light"
                    />
                </div>
            </div>

            {loading && history.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    <p>Nenhuma transcrição encontrada.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    <AnimatePresence mode="popLayout">
                        {history.map((item, index) => (
                            <HistoryItem
                                key={item.id}
                                item={item}
                                index={index}
                                onDelete={() => setItemToDelete(item)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-full bg-slate-800/50 text-white hover:bg-indigo-500/20 disabled:opacity-30 disabled:hover:bg-slate-800/50 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-slate-400">
                        Página <span className="text-white font-medium">{page}</span> de <span className="text-white font-medium">{meta.totalPages}</span>
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                        disabled={page === meta.totalPages}
                        className="p-2 rounded-full bg-slate-800/50 text-white hover:bg-indigo-500/20 disabled:opacity-30 disabled:hover:bg-slate-800/50 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDelete}
                title="Excluir Transcrição"
                description={`Tem certeza que deseja excluir "${itemToDelete?.name || itemToDelete?.originalName}"? Esta ação não pode ser desfeita.`}
                isLoading={isDeleting}
            />
        </motion.div>
    );
}

function HistoryItem({ item, index, onDelete }: { item: TranscriptionRecord; index: number; onDelete: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [viewMode, setViewMode] = useState<"original" | "formatted">("formatted");

    // Default to original if no formatted text
    useEffect(() => {
        if (!item.formattedText) setViewMode("original");
    }, [item.formattedText]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ delay: index * 0.05 }}
            className={`glass rounded-2xl p-6 transition-colors border border-white/5 cursor-pointer ${isExpanded ? 'bg-slate-800/60 ring-1 ring-indigo-500/30' : 'hover:bg-slate-800/50'}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                            <FileAudio className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white leading-tight">
                                {item.name || item.originalName}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.createdAt).toLocaleDateString('pt-BR')} às {new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                    <div className="text-slate-500 flex items-center gap-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="p-2 -mr-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                            title="Excluir"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </div>

                {item.description && (
                    <p className="text-sm text-slate-400 pl-[3.25rem] line-clamp-2">
                        {item.description}
                    </p>
                )}

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mt-4 pt-4 border-t border-white/5">

                                {/* Audio Player */}
                                <audio
                                    controls
                                    className="w-full mb-6 opacity-80 hover:opacity-100 transition-opacity h-8"
                                    src={`/uploads/${item.filename}`}
                                />

                                {/* View Toggles */}
                                <div className="flex items-center gap-2 mb-4 bg-slate-900/40 p-1 rounded-lg w-fit">
                                    <button
                                        onClick={() => setViewMode("formatted")}
                                        disabled={!item.formattedText}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "formatted"
                                            ? "bg-indigo-500 text-white shadow"
                                            : "text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            }`}
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        Formatado
                                    </button>
                                    <button
                                        onClick={() => setViewMode("original")}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "original"
                                            ? "bg-indigo-500 text-white shadow"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <AlignLeft className="w-3 h-3" />
                                        Original
                                    </button>
                                </div>

                                <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
                                    <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar text-slate-300 font-light leading-loose prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-200 max-w-none">
                                        {viewMode === "formatted" && item.formattedText ? (
                                            // @ts-ignore
                                            <ReactMarkdown>{item.formattedText}</ReactMarkdown>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{item.text}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
