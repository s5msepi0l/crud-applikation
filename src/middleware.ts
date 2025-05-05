import { NextRequest, NextResponse } from 'next/server';
import { sessions } from './app/lib/server-auth';

export function middleware(req: NextRequest) {
  console.log('Middleware running...');
  
  // Safely get the sessionID cookie value
  const sessionID = req.cookies.get('sessionID')?.value;

  console.log('sessionID:', sessionID); // Log the sessionID to help debug

  // Check if the sessionID exists in the sessions object
  if (req.nextUrl.pathname === '/') {
    if (sessionID) {
      // Check if the session exists for the sessionID (make sure sessions is an object)
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

  // Continue with the request if no redirect
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],  // Middleware will only run for the root path "/"
};
