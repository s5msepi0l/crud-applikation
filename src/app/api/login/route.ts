import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

import { db, sessions, createID } from '@/app/lib/server-auth';

export async function POST(req: NextRequest) {
    const data = await req.json();
    const { email, password } = data;

    let res = NextResponse.json({ status: "Invalid Email or Password" });

    const row = await new Promise<any>((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = ? AND password = ?;`, [email, password], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
    console.log("row; ", row);
    if (row) {
        const sessionID = createID();
        sessions[sessionID] = { userID: row.ID };        

        console.log("Logged in");
        res = NextResponse.json({ status: "Success" });
        res.cookies.set("sessionID", sessionID);
    }

    return res;
}