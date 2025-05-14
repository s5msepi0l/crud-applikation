import { NextRequest, NextResponse } from 'next/server';

import { db } from './app/lib/server-auth';
export async function middleware(req: NextRequest) {
  console.log('Middleware running...');

//        return NextResponse.redirect(new URL('/Dashboard', req.url));

  if (req.cookies.has("sessionID")) {
    //const sessionID = req.cookies.get("sessionID").value;
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/Dashboard", req.url));
    }

  } else return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],  
};
