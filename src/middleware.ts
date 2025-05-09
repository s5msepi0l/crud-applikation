import { NextRequest, NextResponse } from 'next/server';

import { db } from './app/lib/server-auth';
export async function middleware(req: NextRequest) {
  console.log('Middleware running...');

  /*
  const sessionID = req.cookies.get('sessionID')?.value;

  console.log('sessionID:', sessionID);

  if (req.nextUrl.pathname === '/') {
    if (sessionID) {
      const session = sessions[sessionID];
      if (session) {
        console.log('Valid session found, redirecting to /Dashboard');
        return NextResponse.redirect(new URL('/Dashboard', req.url));
      } else {
        console.log('Session not found for sessionID:', sessionID);
      }
    } else {
      console.log('No sessionID cookie found');
    }
  }
  */

  if (req.cookies.has("sessionID")) {
    //const sessionID = req.cookies.get("sessionID").value;

    if (req.nextUrl.pathname === "/") {
      //const session = sessions[sessionID];
    }

  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],  
};
