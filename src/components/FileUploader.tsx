"use client";

import { useState, useRef } from "react";
import { Upload, FileAudio, X, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

export default function FileUploader({
    onFileSelect,
    selectedFile,
}: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
            onFileSelect(file);
        } else {
            alert("Please upload an audio or video file.");
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileSelect(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
                "relative w-full max-w-2xl mx-auto rounded-3xl p-12 transition-all duration-300 cursor-pointer overflow-hidden group",
                "bg-slate-900/50 backdrop-blur-md border",
                dragActive
                    ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]"
                    : "border-white/10 hover:border-white/20 hover:bg-slate-800/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="audio/*,video/*"
                onChange={handleChange}
            />

            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex flex-col items-center justify-center text-center gap-6 relative z-10">
                <AnimatePresence mode="wait">
                    {selectedFile ? (
                        <motion.div
                            key="file"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="flex flex-col items-center w-full max-w-md"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/20">
                                <FileAudio className="w-10 h-10 text-indigo-400" />
                            </div>
                            <p className="text-xl font-medium text-white mb-1 truncate w-full text-center">{selectedFile.name}</p>
                            <p className="text-sm text-slate-400 font-mono mb-6">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>

                            <div className="w-full space-y-4 mb-6 text-left" onClick={(e) => e.stopPropagation()}>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Title (Optional)</label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Meeting with Client"
                                        className="w-full px-4 py-2 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-light"
                                        id="meta-name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Description (Optional)</label>
                                    <textarea
                                        name="description"
                                        placeholder="Brief summary..."
                                        rows={2}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-light resize-none"
                                        id="meta-desc"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={removeFile}
                                className="px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-sm border border-red-500/20"
                            >
                                <X className="w-4 h-4" /> Remover Arquivo
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className={cn(
                                "w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 mb-6",
                                dragActive ? "bg-indigo-500/20 scale-110" : "bg-slate-800/50 group-hover:bg-slate-800"
                            )}>
                                {dragActive ? (
                                    <Upload className="w-10 h-10 text-indigo-400 animate-bounce" />
                                ) : (
                                    <Music className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 transition-colors duration-300" />
                                )}
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-white mb-2 tracking-tight">
                                    Carregar Arquivo de Áudio
                                </p>
                                <p className="text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
                                    Arraste e solte seu arquivo de áudio aqui, ou clique para navegar em sua biblioteca
                                </p>
                            </div>
                            <div className="mt-8 flex gap-3">
                                {["MP3", "WAV", "M4A"].map((format) => (
                                    <span key={format} className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-xs font-medium text-slate-400">
                                        {format}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
