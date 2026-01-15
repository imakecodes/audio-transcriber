import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const name = formData.get("name") as string || null;
        const description = formData.get("description") as string || null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
        }

        // 1. Save File Locally
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate unique filename to avoid collisions
        const timestamp = Date.now();
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const uniqueFilename = `${timestamp}-${sanitizedFilename}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(uploadDir, uniqueFilename);

        await writeFile(filePath, buffer);

        // 2. Transcribe
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const fileLike = new File([buffer], file.name, { type: file.type });

        const response = await openai.audio.transcriptions.create({
            file: fileLike,
            model: "whisper-1",
        });

        const transcript = response.text;

        // 2.5 Post-Process with LLM (Formatting & Auto-Metadata)
        let formattedText = "";
        let finalName = name;
        let finalDescription = description;

        try {
            const systemPrompt = `Você é um editor especialista.
      1. Formate a transcrição abaixo em markdown legível com parágrafos, pontuação e capitalização adequados.
      2. Se o usuário NÃO forneceu um título (name é null ou vazio), gere um título conciso e relevante (máximo 10 palavras).
      3. Se o usuário NÃO forneceu uma descrição (description é null ou vazio), gere um breve resumo (máximo 30 palavras).
      4. Mantenha o idioma original do áudio (Português do Brasil).
      
      Retorne APENAS um objeto JSON VÁLIDO com esta estrutura:
      {
        "formattedText": "string (markdown)",
        "generatedTitle": "string (opcional, apenas se necessário)",
        "generatedDescription": "string (opcional, apenas se necessário)"
      }`;

            // Prepare context for the model about what is missing
            const userContext = `Transcrição:\n${transcript}\n\nTítulo Existente: ${name || "AUSENTE"}\nDescrição Existente: ${description || "AUSENTE"}`;

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userContext },
                ],
                model: "gpt-4-turbo",
                response_format: { type: "json_object" },
            });

            const content = completion.choices[0].message.content;
            if (content) {
                const parsed = JSON.parse(content);
                formattedText = parsed.formattedText || transcript;
                if (!finalName && parsed.generatedTitle) {
                    finalName = parsed.generatedTitle;
                }
                if (!finalDescription && parsed.generatedDescription) {
                    finalDescription = parsed.generatedDescription;
                }
            } else {
                formattedText = transcript;
            }

        } catch (llmError) {
            console.error("LLM Processing failed:", llmError);
            formattedText = transcript;
        }

        // 3. Save to DB
        const record = await prisma.transcription.create({
            data: {
                filename: uniqueFilename,
                originalName: file.name,
                name: finalName,
                description: finalDescription,
                text: transcript,
                formattedText: formattedText || null,
            },
        });

        return NextResponse.json({
            text: transcript,
            formattedText: formattedText,
            record: record
        });

    } catch (error: any) {
        console.error("Transcription error:", error);
        return NextResponse.json({ error: error.message || "Failed to transcribe" }, { status: 500 });
    }
}
