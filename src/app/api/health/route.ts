import { NextResponse } from "next/server";
import { META_API_BASE_URL, META_API_VERSION } from "@/lib/constants";

export async function GET() {
    const token = process.env.META_ACCESS_TOKEN;

    if (!token) {
        return NextResponse.json({
            status: "error",
            message: "META_ACCESS_TOKEN não configurado",
        });
    }

    try {
        // Test the token with a simple debug_token call
        const res = await fetch(
            `${META_API_BASE_URL}/${META_API_VERSION}/me?fields=id,name&access_token=${token}`
        );

        if (!res.ok) {
            const body = await res.json();
            const errorMessage =
                body?.error?.message ?? `HTTP ${res.status}`;
            const errorCode = body?.error?.code;

            // Code 190 = expired/invalid token
            if (errorCode === 190) {
                return NextResponse.json({
                    status: "expired",
                    message: "Token expirado. Gere um novo token no Meta for Developers.",
                });
            }

            return NextResponse.json({
                status: "error",
                message: errorMessage,
            });
        }

        const data = await res.json();
        return NextResponse.json({
            status: "ok",
            message: `Token válido (${data.name ?? data.id})`,
        });
    } catch (error) {
        return NextResponse.json({
            status: "error",
            message: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
}
