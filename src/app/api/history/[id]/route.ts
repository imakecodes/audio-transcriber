import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Ideally we should also delete the file from disk using fs/promises,
        // but for now we'll just delete the record from DB as per typical MVP flow.
        // If needed, we can query the filename first and then delete it.

        // 1. Get filename to delete file (Optional but good practice)
        // const record = await prisma.transcription.findUnique({ where: { id } });
        // if (record) { /* delete file logic */ }

        await prisma.transcription.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
    }
}
