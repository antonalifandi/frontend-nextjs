import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const token = req.cookies.get('access_token')?.value; 
    const url = req.nextUrl.clone();

    if (!token) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    try {
        const secretKey = new TextEncoder().encode('defaultSecretKey'); 
        await jwtVerify(token, secretKey);
        return NextResponse.next(); 
    } catch (error) {
        console.error('JWT Verification Error:', error);
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/', '/dashboard', '/protected-route'],
};
