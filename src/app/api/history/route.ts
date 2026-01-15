import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const where: Prisma.TranscriptionWhereInput = q
            ? {
                OR: [
                    { name: { contains: q } }, // Case insensitive in SQLite usually depends on collation, but standardized here
                    { description: { contains: q } },
                    { text: { contains: q } },
                    { formattedText: { contains: q } },
                ],
            }
            : {};

        const [total, history] = await Promise.all([
            prisma.transcription.count({ where }),
            prisma.transcription.findMany({
                where,
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
        ]);

        return NextResponse.json({
            data: history,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });

    } catch (error) {
        console.error("History fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
