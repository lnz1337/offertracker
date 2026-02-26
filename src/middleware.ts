import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const appPassword = process.env.APP_PASSWORD;

    // If no password is set, skip authentication
    if (!appPassword) {
        return NextResponse.next();
    }

    // Allow cron endpoint (uses its own auth)
    if (request.nextUrl.pathname.startsWith("/api/cron")) {
        return NextResponse.next();
    }

    // Allow the login page and login API
    if (
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/api/auth"
    ) {
        return NextResponse.next();
    }

    // Check for auth cookie
    const authCookie = request.cookies.get("offertracker_auth");
    if (authCookie?.value === "authenticated") {
        return NextResponse.next();
    }

    // Redirect to login for pages, return 401 for API
    if (request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
