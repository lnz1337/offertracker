import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body;

        const appPassword = process.env.APP_PASSWORD;

        if (!appPassword) {
            return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
        }

        if (password !== appPassword) {
            return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
        }

        const response = NextResponse.json({ success: true });
        response.cookies.set("offertracker_auth", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("offertracker_auth");
    return response;
}
