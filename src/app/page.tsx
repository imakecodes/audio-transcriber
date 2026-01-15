"use client";

import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import TranscriptionResult from "@/components/TranscriptionResult";
import { Mic, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [formattedResult, setFormattedResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranscribe = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Get metadata from inputs
      const nameInput = document.getElementById("meta-name") as HTMLInputElement;
      const descInput = document.getElementById("meta-desc") as HTMLTextAreaElement;

      if (nameInput?.value) formData.append("name", nameInput.value);
      if (descInput?.value) formData.append("description", descInput.value);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.text);
      setFormattedResult(data.formattedText);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none mix-blend-screen" />

      <div className="container mx-auto flex flex-col items-center relative z-10">

        {/* Header */}
        <div className="text-center mb-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 text-sm font-medium text-indigo-300"
          >
            <Mic className="w-4 h-4" />
            <span>Transcrição com IA</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold mb-8 tracking-tight"
          >
            Transcreva Áudios <br />
            <span className="text-gradient">com Precisão</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Transforme seus conteúdos de áudio em texto instantaneamente com o poder da OpenAI Whisper e modelos GPT.
          </motion.p>
        </div>

        {/* Controls */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
          <FileUploader onFileSelect={setFile} selectedFile={file} />

          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <button
                  onClick={handleTranscribe}
                  disabled={isLoading}
                  className={`
                    group relative px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg 
                    flex items-center gap-3 transition-all duration-300
                    hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]
                    active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  `}
                >
                  {isLoading ? (
                    "Processando..."
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12 text-indigo-600" />
                      Iniciar Transcrição
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <TranscriptionResult
            text={result}
            formattedText={formattedResult}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* History Section removed - moved to /history page */}
      </div>
    </main>
  );
}
